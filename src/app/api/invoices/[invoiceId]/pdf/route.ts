import PDFDocument from "pdfkit";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatStatus(status: string) {
    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    export async function GET(
    _request: Request,
    { params }: { params: Promise<{ invoiceId: string }> }
    ) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
        return NextResponse.json(
            {
            message: "You must be logged in to download an invoice.",
            },
            { status: 401 }
        );
        }

        const { invoiceId } = await params;

        const user = await prisma.user.findUnique({
        where: {
            email: session.user.email.toLowerCase(),
        },
        select: {
            id: true,
        },
        });

        if (!user) {
        return NextResponse.json(
            {
            message: "Your account could not be found.",
            },
            { status: 404 }
        );
        }

        const membership = await prisma.businessMember.findFirst({
        where: {
            userId: user.id,
            role: "OWNER",
            status: "ACTIVE",
        },
        select: {
            businessId: true,
        },
        });

        if (!membership) {
        return NextResponse.json(
            {
            message: "No active business workspace was found.",
            },
            { status: 404 }
        );
        }

        const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
            businessId: membership.businessId,
        },
        include: {
            business: {
            select: {
                name: true,
                email: true,
                phone: true,
                address: true,
                currency: true,
            },
            },
            customer: {
            select: {
                fullName: true,
                email: true,
                phone: true,
            },
            },
            items: {
            orderBy: {
                createdAt: "asc",
            },
            },
        },
        });

        if (!invoice) {
        return NextResponse.json(
            {
            message: "This invoice could not be found.",
            },
            { status: 404 }
        );
        }

        const currencyFormatter = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: invoice.business.currency,
        maximumFractionDigits: 2,
        });

        const dateFormatter = new Intl.DateTimeFormat("en-MY", {
        day: "numeric",
        month: "long",
        year: "numeric",
        });

        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        const document = new PDFDocument({
            size: "A4",
            margin: 54,
        });

        const chunks: Buffer[] = [];

        document.on("data", (chunk: Buffer) => {
            chunks.push(chunk);
        });

        document.on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        document.on("error", reject);

        const pageWidth = document.page.width;
        const left = 54;
        const right = pageWidth - 54;

        const money = (value: number | string | object) =>
            currencyFormatter.format(Number(value));

        // Header background
        document.rect(0, 0, pageWidth, 125).fill("#15152c");

        document
            .fillColor("#b8f5cf")
            .font("Helvetica-Bold")
            .fontSize(10)
            .text("SERVICEFLOW INVOICE", left, 34);

        document
            .fillColor("#ffffff")
            .font("Helvetica-Bold")
            .fontSize(24)
            .text(invoice.business.name, left, 54);

        document
            .fillColor("#ffffff")
            .font("Helvetica-Bold")
            .fontSize(18)
            .text("INVOICE", right - 150, 35, {
            width: 150,
            align: "right",
            });

        document
            .fillColor("#d5d0e6")
            .font("Helvetica")
            .fontSize(10)
            .text(invoice.invoiceNumber, right - 150, 62, {
            width: 150,
            align: "right",
            });

        document
            .fillColor("#15152c")
            .font("Helvetica-Bold")
            .fontSize(11)
            .text("Bill to", left, 160);

        document
            .fillColor("#28243d")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(invoice.customer.fullName, left, 181);

        document
            .fillColor("#777385")
            .font("Helvetica")
            .fontSize(10)
            .text(invoice.customer.email || "No email provided", left, 201);

        document.text(invoice.customer.phone || "No phone provided", left, 217);

        document
            .fillColor("#15152c")
            .font("Helvetica-Bold")
            .fontSize(11)
            .text("Invoice details", right - 180, 160, {
            width: 180,
            align: "right",
            });

        document
            .fillColor("#777385")
            .font("Helvetica")
            .fontSize(10)
            .text(`Issued: ${dateFormatter.format(invoice.issueDate)}`, right - 180, 181, {
            width: 180,
            align: "right",
            });

        document.text(
            `Due: ${
            invoice.dueDate
                ? dateFormatter.format(invoice.dueDate)
                : "Due on receipt"
            }`,
            right - 180,
            197,
            {
            width: 180,
            align: "right",
            }
        );

        document.text(
            `Status: ${formatStatus(invoice.status)}`,
            right - 180,
            213,
            {
            width: 180,
            align: "right",
            }
        );

        document
            .moveTo(left, 260)
            .lineTo(right, 260)
            .strokeColor("#e7e2ef")
            .stroke();

        document
            .fillColor("#857e96")
            .font("Helvetica-Bold")
            .fontSize(9)
            .text("DESCRIPTION", left, 280);

        document.text("QTY", 325, 280, {
            width: 35,
            align: "right",
        });

        document.text("UNIT PRICE", 380, 280, {
            width: 75,
            align: "right",
        });

        document.text("TOTAL", 470, 280, {
            width: 70,
            align: "right",
        });

        document
            .moveTo(left, 299)
            .lineTo(right, 299)
            .strokeColor("#e7e2ef")
            .stroke();

        let currentY = 320;

        invoice.items.forEach((item) => {
            document
            .fillColor("#28243d")
            .font("Helvetica-Bold")
            .fontSize(10)
            .text(item.description, left, currentY, {
                width: 230,
            });

            document
            .fillColor("#5f5a6e")
            .font("Helvetica")
            .fontSize(10)
            .text(String(item.quantity), 325, currentY, {
                width: 35,
                align: "right",
            });

            document.text(money(item.unitPrice), 380, currentY, {
            width: 75,
            align: "right",
            });

            document
            .fillColor("#28243d")
            .font("Helvetica-Bold")
            .text(money(item.totalPrice), 470, currentY, {
                width: 70,
                align: "right",
            });

            currentY += 32;
        });

        const totalsY = currentY + 25;

        document
            .moveTo(330, totalsY - 12)
            .lineTo(right, totalsY - 12)
            .strokeColor("#e7e2ef")
            .stroke();

        document
            .fillColor("#777385")
            .font("Helvetica")
            .fontSize(10)
            .text("Subtotal", 350, totalsY);

        document.text(money(invoice.subtotal), 470, totalsY, {
            width: 70,
            align: "right",
        });

        document.text("Tax", 350, totalsY + 22);

        document.text(money(invoice.taxAmount), 470, totalsY + 22, {
            width: 70,
            align: "right",
        });

        document
            .fillColor("#15152c")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text("Total", 350, totalsY + 51);

        document.text(money(invoice.totalAmount), 455, totalsY + 51, {
            width: 85,
            align: "right",
        });

        const statusColor =
            invoice.status === "PAID"
            ? "#277246"
            : invoice.status === "OVERDUE"
                ? "#b94d3c"
                : "#684de7";

        const statusBackground =
            invoice.status === "PAID"
            ? "#e4f9ec"
            : invoice.status === "OVERDUE"
                ? "#fff0ed"
                : "#eeeaff";

        const statusY = totalsY + 95;

        document
            .roundedRect(left, statusY, 170, 28, 14)
            .fill(statusBackground);

        document
            .fillColor(statusColor)
            .font("Helvetica-Bold")
            .fontSize(10)
            .text(`Status: ${formatStatus(invoice.status)}`, left + 14, statusY + 9);

        if (invoice.notes) {
            document
            .fillColor("#15152c")
            .font("Helvetica-Bold")
            .fontSize(10)
            .text("Notes", left, statusY + 58);

            document
            .fillColor("#777385")
            .font("Helvetica")
            .fontSize(10)
            .text(invoice.notes, left, statusY + 76, {
                width: 450,
            });
        }

        const footerY = document.page.height - 70;

        document
            .moveTo(left, footerY - 12)
            .lineTo(right, footerY - 12)
            .strokeColor("#e7e2ef")
            .stroke();

        document
            .fillColor("#8a8497")
            .font("Helvetica")
            .fontSize(9)
            .text(
            `Generated by ServiceFlow · ${invoice.business.name}`,
            left,
            footerY
            );

        const contactDetails = [
            invoice.business.email,
            invoice.business.phone,
        ]
            .filter(Boolean)
            .join(" · ");

        document.text(contactDetails || "Thank you for your business.", left, footerY + 14);

        document.end();
        });

        const filename = `${invoice.invoiceNumber}.pdf`;

        return new Response(new Uint8Array(pdfBuffer), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "private, no-store",
        },
        });
    } catch (error) {
        console.error("Invoice PDF error:", error);

        return NextResponse.json(
        {
            message: "Something went wrong while generating this invoice PDF.",
        },
        { status: 500 }
        );
    }
}