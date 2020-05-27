import { Component } from '@angular/core';
import {
    Plugins,
    CameraResultType,
    CameraSource,
    Share,
    SplashScreen,
    Toast,
    Capacitor,
    LocalNotifications,
    Modals,
    Geolocation,
    GeolocationPosition,
} from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'pwa';
    photo: SafeResourceUrl;
    notificationsPermitted: boolean;
    promtResult: string;
    coord: GeolocationPosition;

    constructor(private readonly sanitizer: DomSanitizer) { }

    isAvailable(key: string): boolean {
        return Capacitor.isPluginAvailable(key);
    }

    async takePicture() {
        const image = await Plugins.Camera.getPhoto({
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera,
        });

        this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(
            image && image.dataUrl
        );
    }

    async showToast() {
        await Toast.show({
            text: 'Hello World!',
        });
    }

    async share() {
        let shareRet = await Share.share({
            title: 'See cool stuff',
            text: 'Really awesome thing you need to see right meow',
            url: 'https://github.com/miro-albrecht/pwa-with-native-apis/',
            dialogTitle: 'Share with buddies',
        });
    }

    async showSplash() {
        // Show the splash for two seconds and then auto hide:
        return await Plugins.SplashScreen.show(
            {
                showDuration: 2000,
                autoHide: true,
            },
            console.log
        );
    }

    async requestNotificationPermission() {
        const permission = await LocalNotifications.requestPermission();
        this.notificationsPermitted = permission.granted;
    }

    async sheduleNotification() {
        const notifs = await LocalNotifications.schedule({
            notifications: [
                {
                    title: 'Hello',
                    body: 'This is a working notification',
                    id: 1,
                    schedule: { at: new Date(Date.now() + 1000 * 3) },
                    sound: null,
                    attachments: null,
                    actionTypeId: '',
                    extra: null,
                },
            ],
        });
        console.log('scheduled notifications', notifs);
    }

    async showPrompt() {
        let promptRet = await Modals.prompt({
            title: 'Hello',
            message: "What's your name?",
        });
        console.log('Prompt ret', promptRet);

        this.promtResult = promptRet.value;
    }

    async getCurrentPosition() {
        const coordinates = await Plugins.Geolocation.getCurrentPosition();
        console.log('Current', coordinates);

        this.coord = coordinates;
    }

    hideStatusBar() {
        Plugins.StatusBar.hide();
    }

    showStatusBar() {
        Plugins.StatusBar.show();
    }
}
