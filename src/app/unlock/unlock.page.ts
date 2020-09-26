import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  InAppPurchase2,
  IAPProduct,
} from "@ionic-native/in-app-purchase-2/ngx";
//import { ToastController } from "@ionic/angular";
import { Define } from "../common/define";
import { BnanService } from "../common/bnan.service";

@Component({
  selector: "app-unlock",
  templateUrl: "./unlock.page.html",
  styleUrls: ["./unlock.page.scss"],
})
export class UnlockPage implements OnInit {
  admob = false;
  isApple = false;
  isGoogle = false;
  //errMsg: string = "";

  constructor(
    private store: InAppPurchase2,
    private router: Router,
    //private tc: ToastController,
    private bs: BnanService
  ) {}

  ngOnInit() {
    try {
      this.bs.logs.push("UnlockPage.ngOnInit");
      this.isApple = this.bs.isIos || this.bs.isMac;
      this.isGoogle = this.bs.isAndroid;
      this.store.verbosity = this.store.DEBUG;

      this.store.register({
        id: Define.ADMOB,
        type: this.store.NON_CONSUMABLE,
      });

      // Updated
      this.store.when(Define.ADMOB).updated((p: IAPProduct) => {
        this.onUpdated(p);
      });

      // Cancelled
      this.store.when(Define.ADMOB).cancelled((p) => {
        this.onCancelled(p);
      });

      // Approved
      this.store
        .when(Define.ADMOB)
        .approved((p) => p.verify())
        .verified((p) => p.finish());

      // Track all store errors
      this.store.error((err) => {
        this.onError(err);
      });

      this.store.refresh();
    } catch (e) {
      this.bs.logs.push("UnlockPage.ngOnInit Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  ionViewWillEnter() {
    try {
      this.bs.selectedIndex = Define.PG_UNLOCK;
      this.store.verbosity = this.store.DEBUG;
      this.admob = this.bs.setting.admob;
    } catch (e) {
      this.bs.logs.push("UnlockPage.ionViewWillEnter Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  async order(product: string) {
    try {
      this.bs.logs.push("order product: " + product);

      this.store.order(product);
    } catch (e) {
      this.bs.logs.push("UnlockPage.order Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  async restore() {
    try {
      this.bs.logs.push("restore");

      this.store.ready(() => {
        let restored = false;

        let ul: IAPProduct = null;

        for (let i = 0; i < this.store.products.length; i++) {
          let p = this.store.products[i];

          switch (p.id) {
            case Define.ADMOB:
              ul = p;
              break;
          }
        }

        if (ul == null || ul.owned == false) {
          if (this.bs.setting.admob) {
            this.bs.canceled(Define.ADMOB);
            this.admob = false;
            restored = true;
          } else if (ul != null && ul.state === this.store.APPROVED) {
            this.store.when(ul.id).verified((p) => {
              p.finish();
            });

            ul.verify();
          }
        } else {
          if (this.bs.setting.admob == false) {
            this.bs.bought(Define.ADMOB);
            this.admob = true;
            restored = true;
          }
        }

        if (restored) {
          window.alert("購入が復元しました。");
        }
      });

      // Refresh the status of in-app products
      this.store.refresh();
    } catch (e) {
      this.bs.logs.push("UnlockPage.restore Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  onError(err: any) {
    try {
      let msg: string = err.message;
      this.bs.logs.push("UnlockPage.onError: " + msg);

      if (
        msg.startsWith("The purchase queue contains unknown product") ||
        msg.startsWith("ITEM_NOT_OWNED") ||
        msg.startsWith("Purchase failed: ITEM_ALREADY_OWNED") ||
        msg.startsWith("Purchase failed: Product not registered")
      ) {
        return;
      }

      this.router.navigate(["/error"]);
    } catch (e) {
      this.bs.logs.push("UnlockPage.onError Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  onCancelled(p: IAPProduct) {
    try {
      this.bs.logs.push("onCancelled: " + JSON.stringify(p));
      this.bs.canceled(p.id);
    } catch (e) {
      this.bs.logs.push("UnlockPage.onCancelled Error! " + e);
      this.router.navigate(["/error"]);
    }
  }

  onUpdated(p: IAPProduct) {
    try {
      this.bs.logs.push("onUpdated: " + JSON.stringify(p));

      if (p.owned == false) {
        return;
      }

      switch (p.id) {
        case Define.ADMOB:
          if (this.bs.setting.admob) {
            return;
          }
          break;
      }

      switch (p.state) {
        case this.store.FINISHED:
          this.bs.logs.push("finished.");
          break;

        case this.store.OWNED:
          this.bs.logs.push("owned.");
          break;

        default:
          return;
      }

      this.bs.bought(p.id).then(() => {
        window.alert("購入が完了しました。");
        /*
        this.tc
          .create({
            color: "dark",
            message: "購入が完了しました。",
            duration: 2000,
          })
          .then((toast) => toast.present())
          .catch((e) => {
            this.bs.logs.push("UnlockPage.onUpdated Error! " + e);
            this.router.navigate(["/error"]);
          });
        */
      });
    } catch (e) {
      this.bs.logs.push("UnlockPage.onUpdated Error! " + e);
      this.router.navigate(["/error"]);
    }
  }
}
