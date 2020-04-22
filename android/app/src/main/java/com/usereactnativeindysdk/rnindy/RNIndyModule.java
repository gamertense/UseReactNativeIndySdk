//  Created by react-native-create-bridge

package com.usereactnativeindysdk.rnindy;

import android.util.Log;

import com.usereactnativeindysdk.BridgeUtils;
import com.evernym.sdk.vcx.VcxException;
import com.evernym.sdk.vcx.connection.ConnectionApi;
import com.evernym.sdk.vcx.credential.CredentialApi;
import com.evernym.sdk.vcx.proof.DisclosedProofApi;
import com.evernym.sdk.vcx.utils.UtilsApi;
import com.evernym.sdk.vcx.vcx.AlreadyInitializedException;
import com.evernym.sdk.vcx.vcx.VcxApi;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNIndyModule extends ReactContextBaseJavaModule {
    private static final String REACT_CLASS = "RNIndy";
    private static final String TAG = "RNIndy::";
    private static final int BUFFER = 2048;
    private static ReactApplicationContext reactContext = null;
    // TODO:Remove this class once integration with vcx is done
    private static RNIndyStaticData staticData = new RNIndyStaticData();

    public RNIndyModule(ReactApplicationContext context) {
        // Pass in the context to the constructor and save it so you can emit events
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        super(context);

        reactContext = context;
    }

    @Override
    public String getName() {
        // Tell React the name of the module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        return REACT_CLASS;
    }

    @ReactMethod
    public void createOneTimeInfo(String agencyConfig, Promise promise) {
        Log.d(TAG, "createOneTimeInfo() called with: agencyConfig = [" + agencyConfig + "]");
        // We have top create thew ca cert for the openssl to work properly on android
        BridgeUtils.writeCACert(this.getReactApplicationContext());

        try {
            UtilsApi.vcxAgentProvisionAsync(agencyConfig).exceptionally((t) -> {
                Log.e(TAG, "createOneTimeInfo: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                Log.d(TAG, "vcx::APP::async result Prov: " + result);
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void init(String config, Promise promise) {
        Log.d(TAG, " ==> init() called with: config = [" + config + "], promise = [" + promise + "]");
        // When we restore data, then we are not calling createOneTimeInfo
        // and hence ca-crt is not written within app directory
        // since the logic to write ca cert checks for file existence
        // we won't have to pay too much cost for calling this function inside init
        BridgeUtils.writeCACert(this.getReactApplicationContext());

        try {
            VcxApi.vcxInitWithConfig(config).exceptionally((t) -> {
                Log.e(TAG, "init: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                // Need to put this logic in every accept because that is how ugly Java's
                // promise API is
                // even if exceptionally is called, then also thenAccept block will be called
                // we either need to switch to complete method and pass two callbacks as
                // parameter
                // till we change to that API, we have to live with this IF condition
                // also reason to add this if condition is because we already rejected promise
                // in
                // exceptionally block, if we call promise.resolve now, then it `thenAccept`
                // block
                // would throw an exception that would not be caught here, because this is an
                // async
                // block and above try catch would not catch this exception
                if (result != -1) {
                    promise.resolve(true);
                }
            });

        } catch (AlreadyInitializedException e) {
            // even if we get already initialized exception
            // then also we will resolve promise, because we don't care if vcx is already
            // initialized
            promise.resolve(true);
        } catch (VcxException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    @ReactMethod
    public void createConnectionWithInvite(String invitationId, String inviteDetails, Promise promise) {
        Log.d(TAG, "createConnectionWithInvite() called with: invitationId = [" + invitationId + "], inviteDetails = ["
                + inviteDetails + "], promise = [" + promise + "]");
        try {
            ConnectionApi.vcxCreateConnectionWithInvite(invitationId, inviteDetails).exceptionally((t) -> {
                Log.e(TAG, "createConnectionWithInvite: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });

        } catch (Exception e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void vcxAcceptInvitation(int connectionHandle, String connectionType, Promise promise) {
        Log.d(TAG, "acceptInvitation() called with: connectionHandle = [" + connectionHandle + "], connectionType = ["
                + connectionType + "], promise = [" + promise + "]");
        try {
            ConnectionApi.vcxAcceptInvitation(connectionHandle, connectionType).exceptionally((t) -> {
                Log.e(TAG, "vcxAcceptInvitation: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> BridgeUtils.resolveIfValid(promise, result));
        } catch (VcxException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    @ReactMethod
    public void connectionGetState(int connectionHandle, Promise promise) throws VcxException {
        Log.d(TAG, "connectionGetState() called with: connectionHandle = [" + connectionHandle + "]");
		try {
            ConnectionApi.connectionGetState(connectionHandle).exceptionally((t) -> {
                Log.e(TAG, "connectionGetState: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> BridgeUtils.resolveIfValid(promise, result));

        } catch (Exception e) {
            promise.reject("connectionGetState", e.getMessage());
        }
	}

    @ReactMethod
    public void vcxConnectionUpdateState(int connectionHandle, Promise promise) throws VcxException {
        Log.d(TAG, "vcxConnectionUpdateState() called with: connectionHandle = [" + connectionHandle + "]");
		try {
            ConnectionApi.vcxConnectionUpdateState(connectionHandle).exceptionally((t) -> {
                Log.e(TAG, "vcxConnectionUpdateState: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });

        } catch (Exception e) {
            promise.reject("vcxConnectionUpdateState", e.getMessage());
        }
	}

    @ReactMethod
    public void credentialGetOffers(int connectionHandle, Promise promise) {
        try {
            CredentialApi.credentialGetOffers(connectionHandle).exceptionally((t) -> {
                Log.e(TAG, "getCredentialOffers: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> BridgeUtils.resolveIfValid(promise, result));
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void credentialCreateWithOffer(String sourceId, String credentialOffer, Promise promise) {
        try {
            CredentialApi.credentialCreateWithOffer(sourceId, credentialOffer).exceptionally((t) -> {
                Log.e(TAG, "createCredentialWithOffer: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> BridgeUtils.resolveIfValid(promise, result));
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void credentialSendRequest(int credentialHandle, int connectionHandle, int paymentHandle, Promise promise) {
        // it would return an error code in callback
        // we resolve promise with an empty string after success
        // or reject promise with error code

        try {
            CredentialApi.credentialSendRequest(credentialHandle, connectionHandle, paymentHandle)
                    .exceptionally((t) -> {
                        Log.e(TAG, "credentialSendRequest: ", t);
                        promise.reject("FutureException", t.getMessage());
                        return null;
                    }).thenAccept(result -> {
                        BridgeUtils.resolveIfValid(promise, result);
                    });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void credentialGetState(int credentialHandle, Promise promise) {
        try {
            CredentialApi.credentialGetState(credentialHandle).exceptionally((t) -> {
                Log.e(TAG, "credentialGetState: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void credentialUpdateState(int credentialHandle, Promise promise) {
        try {
            CredentialApi.credentialUpdateState(credentialHandle).exceptionally((t) -> {
                Log.e(TAG, "credentialUpdateState: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void proofGetRequests(int connectionHandle, Promise promise) throws VcxException {
        Log.d(TAG, "proofGetRequests() called with: connectionHandle = [" + connectionHandle + "]");
		try {
            DisclosedProofApi.proofGetRequests(connectionHandle).exceptionally((t) -> {
                Log.e(TAG, "proofGetRequests: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> BridgeUtils.resolveIfValid(promise, result));

        } catch (Exception e) {
            promise.reject("proofGetRequests", e.getMessage());
        }
	}

    @ReactMethod
    public void proofCreateWithRequest(String sourceId, String proofRequest, Promise promise) {
        Log.d(TAG, "proofCreateWithRequest() called with sourceId = ["+ sourceId +"], proofRequest =["+ proofRequest +"]");

        try {
            DisclosedProofApi.proofCreateWithRequest(sourceId, proofRequest).exceptionally((t)-> {
                Log.d(TAG, "proofCreateWithRequest", t);
                promise.reject("VcxException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch(VcxException e) {
            promise.reject("VcxException", e.getMessage());
        }
    }

    @ReactMethod
    public void proofRetrieveCredentials(int proofHandle, Promise promise) {
        Log.d(TAG, "proofRetrieveCredentials() called with: proofHandle = [" + proofHandle + "]");

        try {
            DisclosedProofApi.proofRetrieveCredentials(proofHandle).exceptionally((t)-> {
                Log.d(TAG, "proofRetrieveCredentials", t);
                promise.reject("VcxException", t.getMessage());
                return null;
            }).thenAccept(result -> BridgeUtils.resolveIfValid(promise, result));
        } catch(VcxException e) {
            promise.reject("VcxException", e.getMessage());
        }
    }

    @ReactMethod
    public void proofGenerate(int proofHandle, String selectedCredentials, String selfAttestedAttributes,
            Promise promise) {
        try {
            DisclosedProofApi.proofGenerate(proofHandle, selectedCredentials, selfAttestedAttributes)
                    .exceptionally((t) -> {
                        Log.e(TAG, "proofGenerate: ", t);
                        promise.reject("FutureException", t.getMessage());
                        return -1;
                    }).thenAccept(result -> {
                        if (result != -1) {
                            BridgeUtils.resolveIfValid(promise, result);
                        }
                    });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void proofSend(int proofHandle, int connectionHandle, Promise promise) {
        try {
            DisclosedProofApi.proofSend(proofHandle, connectionHandle).exceptionally((t) -> {
                Log.e(TAG, "proofSend: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }
}
