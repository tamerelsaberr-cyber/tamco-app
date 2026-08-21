/**
 * TAMCO CLEAN PROJECT - SYSTEM CONFIGURATION
 * ملف إعدادات النظام وربط شبكة باى والتحكم الفوري لوضع الصيانة
 */

// 1. إعدادات بيئة العمل والروابط الأساسية لشبكة باى (Pi Network Platform API)
export const PI_NETWORK_CONFIG = {
  API_BASE_URL: 'https://minepi.com',
  SDK_VERSION: 'v2',
  // توكن افتراضي للاختبار في بيئة التطوير المذكورة بالمستندات لـ testing rings
  SANDBOX_TOKEN: 'pi_test_token_override_privileges_master',
sandbox: true
};

// 2. واجهة البيانات الخاصة بالتحكم الكلي للأدمن (Master Control Interface Type)
export interface SystemControlState {
  isMaintenanceMode: boolean; // وضع الصيانة (Global Master Switch)
  appModuleStatus: {
    chat: boolean;
    marketplace: boolean;
    transfers: boolean;
  };
  allowedAdminRoles: string[];
}

// 3. الإعدادات الافتراضية والديناميكية للنظام (Dynamic Configurations)
export const initialSystemState: SystemControlState = {
  isMaintenanceMode: false, // القيمة الافتراضية: التطبيق يعمل بشكل طبيعي
  appModuleStatus: {
    chat: true,         // تفعيل/تعطيل المحادثة فورياً
    marketplace: true,  // تفعيل/تعطيل متجر الأثاث
    transfers: true,    // تفعيل/تعطيل تحويلات عملة Pi
  },
  allowedAdminRoles: ['ACTIVE_MASTER', 'MASTER_OVERRIDE'],
};

// 4. دالة فحص وتأمين الصلاحيات قبل تمرير البيانات لحماية النظام (Client-Side Route Guard Helper)
export const verifyClientAdminSession = (): boolean => {
  if (typeof window === 'undefined') return false;

  const currentRole = localStorage.getItem('tamco_admin_role');
  const piToken = localStorage.getItem('pi_token');

  // مطابقة الشروط المذكورة بملف المواصفات التقنية (Specification Document)
  if (!piToken || currentRole !== 'ACTIVE_MASTER') {
    console.error('Access Denied: Insufficient Administrative Permissions.');
    return false;
  }

  return true;
};

// 5. مفاتيح الهيدرز الموحدة لإرسال الطلبات إلى خادم الماستر آدمن (Admin Headers Layout)
export const getAdminSecureHeaders = (piAccessToken: string, masterKeyHash: string) => {
  return {
    'Content-Type': 'application/json',
    'x-pi-access-token': piAccessToken,
    'x-admin-master-key': masterKeyHash,
  };
};