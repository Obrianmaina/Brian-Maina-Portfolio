import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return new NextResponse("Unauthorized access", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") || new Date().getFullYear().toString();

    const client = await clientPromise;
    const db = client.db("portfolio");

    // Fetch transactions strictly for the requested year
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const transactions = await db
      .collection("transactions")
      .find({
        date: { $gte: startDate, $lte: endDate },
        status: 'paid' 
      })
      .sort({ date: 1 })
      .toArray();

    // Define KRA CSV Headers
    const headers = [
      "Date", 
      "Transaction Type", 
      "Client / Vendor Name", 
      "Description", 
      "Expense Category", 
      "Currency", 
      "Gross Amount",
      "Withholding Tax (WHT)" 
    ];

    // Map transactions to CSV rows
    const rows = transactions.map(tx => {
      const txDate = new Date(tx.date).toLocaleDateString('en-KE');
      const type = tx.type === 'expense' ? 'Deductible Expense' : 'Gross Income';
      
      const name = `"${(tx.clientName || '').replace(/"/g, '""')}"`;
      const desc = `"${(tx.description || '').replace(/"/g, '""')}"`;
      
      const cat = tx.type === 'expense' ? (tx.expenseCategory || 'General') : 'Service Revenue';
      const currency = tx.currency || 'EUR';
      const amount = tx.amount;
      const wht = tx.withholdingTax || 0; 

      return [txDate, type, name, desc, cat, currency, amount, wht].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="KRA_Tax_Report_${year}.csv"`,
      },
    });

  } catch (error) {
    console.error("Export Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}