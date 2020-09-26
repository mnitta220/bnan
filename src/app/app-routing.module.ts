import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "init",
    pathMatch: "full",
  },
  {
    path: "about",
    loadChildren: () =>
      import("./about/about.module").then((m) => m.AboutPageModule),
  },
  {
    path: "log",
    loadChildren: () => import("./log/log.module").then((m) => m.LogPageModule),
  },
  {
    path: "usage",
    loadChildren: () =>
      import("./usage/usage.module").then((m) => m.UsagePageModule),
  },
  {
    path: "init",
    loadChildren: () =>
      import("./init/init.module").then((m) => m.InitPageModule),
  },
  {
    path: "doc-list",
    loadChildren: () =>
      import("./doc-list/doc-list.module").then((m) => m.DocListPageModule),
  },
  {
    path: "doc-info",
    loadChildren: () =>
      import("./doc-info/doc-info.module").then((m) => m.DocInfoPageModule),
  },
  {
    path: "doc-view",
    loadChildren: () =>
      import("./doc-view/doc-view.module").then((m) => m.DocViewPageModule),
  },
  {
    path: "error",
    loadChildren: () =>
      import("./error/error.module").then((m) => m.ErrorPageModule),
  },
  {
    path: "usage-list",
    loadChildren: () =>
      import("./usage-list/usage-list.module").then(
        (m) => m.UsageListPageModule
      ),
  },
  {
    path: "usage-doc",
    loadChildren: () =>
      import("./usage-doc/usage-doc.module").then((m) => m.UsageDocPageModule),
  },
  {
    path: "usage-view",
    loadChildren: () =>
      import("./usage-view/usage-view.module").then(
        (m) => m.UsageViewPageModule
      ),
  },
  {
    path: "unlock",
    loadChildren: () =>
      import("./unlock/unlock.module").then((m) => m.UnlockPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
