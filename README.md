# PWA with access to native APIs on mobile

This is a demo project to explore the possibilities of adding native API access to an existing PWA.
In this case, we try Capacitor.

## Prerequisites

A up to date version of node with npm is required. Also install the Angular cli.

You need a SPA with a manifest and a service worker, which makes it a PWA. You can skip the rest of the prerequisites if you already have an application ready.

```bash
ng new awesome-ewm-app
```

Let's use Angular to make our app a PWA. After this step, you can inspect the generated manifest in the `src` folder.

```bash
cd awersome-ewm-app
ng add @angular/pwa
```

`ng serve` doesn't work with service workers, so a different HTTP server is required. In the Angular docs `http-server` is suggested.

```bash
npm i -g http-server
```

To run the application, build it with Angular and use `http-server` to run it.

```bash
ng build --prod
http-server dist/awesome-ewm-app -p 8080 -c-1
```

Open `localhost:8080` to view your application live.

> Note: If you are not using HTTPS, the service worker will only be registered when accessing the app on localhost.

You can test your PWA by setting the network to offline in the developer tools of your browser. The application should still be displayed, even after a refresh. However changes are loaded in the background and not applied immediately.

Source: [Getting started with service workers (Angular Docs)](https://angular.io/guide/service-worker-getting-started)

## Use Capacitor to access native APIs

### Installation

Install Capacitor with `npm`.

```bash
npm i --save @capacitor/core @capacitor/cli
```

Initialize Capacitor. Don't forget to pass the `--web-dir` parameter, the default value doesn't work with Angular.

```bash
npx cap init --web-dir dist/awesome-ewm-app
```

Add the platforms you want to use. These work in addition to the existing PWA.

```bash
npx cap add android
npx cap add ios
npx cap add electron
```

> Note: You need working development environments to test the platforms. However you can add them and still just test the PWA in your browser.

### Optionally add PWA Elements

Some Capacitor APIs work only on mobile (e.g. Camera), however a fallback for PWAs can be used. PWA Elements provide a web-based UI for *some* of the APIs, but not all of them.

```bash
npm i @ionic/pwa-elements
```

Register the custom elements in the `main.ts` of your Angular application:

```typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Add import
import { defineCustomElements } from '@ionic/pwa-elements/loader';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);
```

### Example: Use Camera API

Choose any component, for demonstration purposes we just use the AppComponent.

```typescript
import { Component } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {

    // Add property to show the photo
    photo: SafeResourceUrl;

    constructor(private readonly sanitizer: DomSanitizer) { }

    // Add a method for taking pictures
    async takePicture() {

        // Use the Capacitor API
        const image = await Plugins.Camera.getPhoto({
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera,
        });

        // Use sanizizer to tell Angular to trust the dynamic image data
        this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(
            image && image.dataUrl
        );
    }
}

```

Add an image container to show the picture and a button to take one:

```html
<section>
    <img [src]="photo" alt="Picture taken with Capacitor API"><br>
    <button (click)="takePicture()">Take picture</button>
</section>
```

Build the application with Angular:

```bash
ng build --prod
```

#### PWA

Run it with the `http-server` as described above.

#### iOS / Android

After changes to the application, you need to run `copy`:

```bash
npx cap copy
```

After changes to the native part of the code (such as adding a new plugin), use `sync`:

```bash
npx cap sync
```

Open the native projects in Xcode or Android Studio:

```bash
npx cap open ios
npx cap open android
```

Source: [Installing Capacitor](https://capacitor.ionicframework.com/docs/getting-started) and [Building an Ionic Framework Camera App](https://capacitor.ionicframework.com/docs/guides/ionic-framework-app)
