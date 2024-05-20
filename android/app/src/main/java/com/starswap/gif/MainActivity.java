package com.starswap.gif;

import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        
        int customColor = 0xFF262626;
        
        window.setNavigationBarColor(customColor);

        window.setStatusBarColor(customColor);
    }
}