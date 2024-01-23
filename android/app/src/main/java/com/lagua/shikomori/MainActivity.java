package com.lagua.shikomori;

import android.os.Bundle;

import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.community.firebaseanalytics.FirebaseAnalytics;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle saveInstanceState) {
    super.onCreate(saveInstanceState);
    this.registerPlugin(GoogleAuth.class);
    this.registerPlugin(FirebaseAnalytics.class);
  }
}
