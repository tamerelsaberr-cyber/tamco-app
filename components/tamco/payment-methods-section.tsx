const handlePiPayment = async () => {
    if (typeof window !== "undefined" && window.Pi) {
      try {
        // 1. تهيئة المكتبة
        await window.Pi.init({ version: "2.0", sandbox: true });

        // 2. تسجيل دخول المستخدم وجلب بياناته الحقيقية (بما فيها الـ UID)
        const scopes = ["username", "payments"];
        const authResult = await window.Pi.authenticate(scopes, (payment: any) => {
          console.log("Payment in progress: ", payment);
        });

        const userUid = authResult.user.uid; // جلب الـ UID الحقيقي للمستخدم الحالي

        // 3. إرسال الـ UID الحقيقي والبيانات إلى السيرفر الخلفي لإصدار المعاملة
        const serverPaymentRes = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            amount: 1, 
            memo: "Complete Step 10 Verification",
            uid: userUid // تمرير المعرف الحقيقي
          })
        });

        const serverPaymentData = await serverPaymentRes.json();

        if (!serverPaymentData || !serverPaymentData.identifier) {
          alert("خطأ: لم يتمكن السيرفر من جلب معرف الدفع الجديد");
          return;
        }

        // 4. تشغيل واجهة الدفع بالمعرف الديناميكي الموثق
        window.Pi.createPayment({
          paymentId: serverPaymentData.identifier
        }, {
          onReadyForServerApproval: async function(paymentId: string) {
            try {
              await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, action: "approve" })
              });
            } catch (err) {
              console.error("Approval error:", err);
            }
          },
          onReadyForServerCompletion: async function(paymentId: string, txid: string) {
            try {
              await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid, action: "complete" })
              });
              alert("تمت عملية الدفع وتوثيق الخطوة بنجاح كامل!");
            } catch (err) {
              console.error("Completion error:", err);
            }
          },
          onCancel: function(paymentId: string) {
            alert("تم إلغاء عملية الدفع");
          },
          onError: function(error: any, payment: any) {
            alert("حدث خطأ أثناء معالجة الدفع: " + error.message);
          }
        });

      } catch (error: any) {
        alert("فشلت عملية المصادقة: " + error.message);
      }
    } else {
      alert("تنبيه: يرجى فتح الرابط من داخل تطبيق Pi Browser");
    }
  };