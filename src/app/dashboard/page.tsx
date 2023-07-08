import KpisWidget from "@/app/dashboard/_components/kpis-widget";
import OnlineUsersWidget from "@/app/dashboard/_components/online-users-widget";
import TopBrowsersWidget from "@/app/dashboard/_components/top-browsers-widget";
import TopDevicesWidget from "@/app/dashboard/_components/top-devices-widget";
import TopLocationsWidget from "@/app/dashboard/_components/top-locations-widget";
import TopPagesWidget from "@/app/dashboard/_components/top-pages-widget";
import TopSourcesWidget from "@/app/dashboard/_components/top-sources-widget";
import { Card } from "@tremor/react";
import { Suspense } from "react";

const enum WidgetHeight {
  XLarge = 588,
  Large = 472,
  Medium = 344,
  Small = 216,
}

export default async function DashboardExample() {
  return (
    <div className="bg-body min-h-screen py-5 px-5 sm:px-10 text-sm leading-5 text-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6 sm:space-y-10">
          {/* {isAuthenticated && isTokenValid && (
          <>
            <img src="/icon.png" alt="" width={24} height={24} />
            <Header />
          </>
        )} */}
          <main>
            <div className="grid grid-cols-2 gap-5 sm:gap-10 grid-rows-3-auto">
              <div className="col-span-2">
                <KpisWidget />
              </div>
              <div className="col-start-1 col-span-2 lg:col-span-1 grid grid-cols-1 gap-5 sm:gap-10 grid-rows-3-auto">
                <div style={{ height: WidgetHeight.Small }}>
                  <Suspense fallback={<Card>Loading...</Card>}>
                    <OnlineUsersWidget />
                  </Suspense>
                </div>
                <div style={{ height: WidgetHeight.Large }}>
                  <Suspense fallback={<Card>Loading...</Card>}>
                    <TopPagesWidget />
                  </Suspense>{" "}
                </div>
                <div style={{ height: WidgetHeight.Large }}>
                  <Suspense fallback={<Card>Loading...</Card>}>
                    <TopLocationsWidget />
                  </Suspense>{" "}
                </div>
              </div>
              <div className="col-start-1 col-span-2 lg:col-start-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 sm:gap-10 grid-rows-2-auto lg:grid-rows-3-auto">
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                  <div style={{ height: WidgetHeight.Large }}>
                    <Suspense fallback={<Card>Loading...</Card>}>
                      <TopSourcesWidget />
                    </Suspense>{" "}
                  </div>
                </div>
                <div style={{ height: WidgetHeight.Medium }}>
                  <Suspense fallback={<Card>Loading...</Card>}>
                    <TopDevicesWidget />
                  </Suspense>
                </div>
                <div style={{ height: WidgetHeight.Medium }}>
                  <Suspense fallback={<Card>Loading...</Card>}>
                    <TopBrowsersWidget />
                  </Suspense>{" "}
                </div>
              </div>
            </div>
          </main>
        </div>
        {/* {isAuthenticated && (
        <div className="mt-20">
          <Footer />
        </div>
      )} */}
      </div>
    </div>
  );
}
