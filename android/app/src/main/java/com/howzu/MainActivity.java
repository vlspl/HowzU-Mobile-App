package com.howzu;

import com.facebook.react.ReactActivity;

import io.realm.react.RealmReactPackage;
import android.os.Bundle;
import android.content.Intent;
// import io.invertase.notifee.NotifeeApiModule;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    // return NotifeeApiModule.getMainComponent("HowzU");
    return "HowzU";
  }
   @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        try {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
            }
        } catch (Exception e) {
            System.err.println("Exception when handling notification opened. " + e);
        }
    }
}
