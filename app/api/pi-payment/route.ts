
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// دالة استقبال طلبات الدفع (POST Request)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // هنا سيتم وضع منطق التحقق من الدفع لاحقاً
    console.log("بيانات الدفع المستلمة:", body);

    return NextResponse.json({ 
      success: true, 
      message: "تم استلام طلب الدفع بنجاح" 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "حدث خطأ أثناء معالجة الطلب" 
    }, { status: 400 });
  }
}