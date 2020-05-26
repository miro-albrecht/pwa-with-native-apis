import { Component } from '@angular/core';
import { Plugins, CameraResultType, CameraSource, Share, SplashScreen, Toast, Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'pwa';
    photo: SafeResourceUrl;



    /**
     *
     */
    constructor(private readonly sanitizer: DomSanitizer) {
        
    }

    isAv(key: string): boolean {
        return Capacitor.isPluginAvailable(key);
    }

    async share() {
        let shareRet = await Share.share({
            title: 'See cool stuff',
            text: 'Really awesome thing you need to see right meow',
            url: 'http://ionicframework.com/',
            dialogTitle: 'Share with buddies'
        });
    }
    
    async showToast() {
        await Toast.show({
          text: 'Hello!'
        });
      }

    async showSplash() {
        // Show the splash for two seconds and then auto hide:
        SplashScreen.show({
            showDuration: 2000,
            autoHide: true
          });
    }

    async takePicture() {
        const image = await Plugins.Camera.getPhoto({
          quality: 100,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera
        });
    
        this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
      }

}
