import { NotificationBanner } from "./NotificationBanner";
import { OrderControlsPanel } from "./OrderControlsPanel";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import { useOrderForm } from "./logic/useOrderForm";

function App() {
    const orderForm = useOrderForm();
    const {
        state,
        summaryOrder,
        canConfirm,
        canDownload,
        message,
        bannerMessage,
        onValueChange,
        onConfirmOrder,
        onDownloadReport,
        onResetOrder,
    } = orderForm;

    return (
        <main className="app-shell">
            <section className="order-card">
                <OrderControlsPanel
                    values={state.values}
                    onValueChange={onValueChange}
                />

                <OrderSummaryPanel
                    orderId={state.orderId}
                    summaryOrder={summaryOrder}
                    canConfirm={canConfirm}
                    canDownload={canDownload}
                    message={message}
                    onConfirm={onConfirmOrder}
                    onDownloadReport={onDownloadReport}
                    onNewOrder={onResetOrder}
                />
            </section>

            <NotificationBanner message={bannerMessage} />
        </main>
    );
}

export default App;
