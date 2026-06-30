import { Download } from "lucide-react";

type DownloadInvoiceButtonProps = {
    invoiceId: string;
    invoiceNumber: string;
    };

    export default function DownloadInvoiceButton({
    invoiceId,
    invoiceNumber,
    }: DownloadInvoiceButtonProps) {
    return (
        <a
        href={`/api/invoices/${invoiceId}/pdf`}
        className="inline-flex items-center gap-2 rounded-lg bg-[#eeeaff] px-3 py-2 text-xs font-bold text-[#684de7] transition hover:bg-[#ded6ff] hover:text-[#5136d4]"
        aria-label={`Download ${invoiceNumber} as PDF`}
        >
        <Download className="size-3.5" />
        PDF
        </a>
    );
}