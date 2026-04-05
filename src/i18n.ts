export type UILanguage = "en" | "ko";

const DEFAULT_UI_LANGUAGE: UILanguage = "en";

const LOCALE_BY_LANGUAGE: Record<UILanguage, string> = {
  en: "en-US",
  ko: "ko-KR",
};

function isUILanguage(value: string): value is UILanguage {
  return value === "en" || value === "ko";
}

function detectSystemLanguage(): UILanguage {
  if (typeof navigator === "undefined") {
    return DEFAULT_UI_LANGUAGE;
  }

  const languageCode = navigator.language.toLowerCase().split("-")[0];
  if (isUILanguage(languageCode)) {
    return languageCode;
  }

  return DEFAULT_UI_LANGUAGE;
}

let currentLanguage: UILanguage = detectSystemLanguage();

type MessageKey =
  | "app.salesReport"
  | "app.switchAccount"
  | "app.language"
  | "app.langEnglish"
  | "app.langKorean"
  | "login.title"
  | "login.subtitle"
  | "login.storeCode"
  | "login.storeCodePlaceholder"
  | "login.accountId"
  | "login.accountIdPlaceholder"
  | "login.submit"
  | "date.queryPeriod"
  | "date.prevDay"
  | "date.nextDay"
  | "date.pickDate"
  | "date.cancel"
  | "date.apply"
  | "date.loadSales"
  | "date.loadingReport"
  | "range.today"
  | "range.oneWeek"
  | "range.oneMonth"
  | "range.oneYear"
  | "stats.total"
  | "stats.grossSales"
  | "stats.fundTotal"
  | "stats.payoutAmount"
  | "stats.unitsSold"
  | "report.period"
  | "report.products"
  | "report.items"
  | "report.session"
  | "report.sessionTemporaryLogin"
  | "product.itemsHeading"
  | "product.product"
  | "product.sold"
  | "product.variants"
  | "footer.home"
  | "footer.sales"
  | "footer.inventory"
  | "footer.settings"
  | "table.variant"
  | "table.sold"
  | "table.grossSales"
  | "table.fundTotal"
  | "table.payout"
  | "error.loginRequired"
  | "error.identityRequired";

const messages: Record<UILanguage, Record<MessageKey, string>> = {
  en: {
    "app.salesReport": "Sales report",
    "app.switchAccount": "Switch account",
    "app.language": "Language",
    "app.langEnglish": "English",
    "app.langKorean": "Korean",
    "login.title": "Jangbu Producer Portal",
    "login.subtitle": "Sign in once to use your sales dashboard.",
    "login.storeCode": "Store code",
    "login.storeCodePlaceholder": "Enter your store code",
    "login.accountId": "Account ID",
    "login.accountIdPlaceholder": "Enter your account ID",
    "login.submit": "Log in",
    "date.queryPeriod": "Query period",
    "date.prevDay": "Previous range",
    "date.nextDay": "Next range",
    "date.pickDate": "Pick date",
    "date.cancel": "Cancel",
    "date.apply": "Apply",
    "date.loadSales": "Load sales",
    "date.loadingReport": "Loading report...",
    "range.today": "Daily",
    "range.oneWeek": "Weekly",
    "range.oneMonth": "Monthly",
    "range.oneYear": "Yearly",
    "stats.total": "Total",
    "stats.grossSales": "Gross sales",
    "stats.fundTotal": "Fund total",
    "stats.payoutAmount": "Payout amount",
    "stats.unitsSold": "Units sold",
    "report.period": "Report period",
    "report.products": "Products",
    "report.items": "items",
    "report.session": "Session",
    "report.sessionTemporaryLogin": "Temporary login active",
    "product.itemsHeading": "Sales items",
    "product.product": "Product",
    "product.sold": "sold",
    "product.variants": "Variants",
    "footer.home": "Home",
    "footer.sales": "Sales",
    "footer.inventory": "Inventory",
    "footer.settings": "Settings",
    "table.variant": "Variant",
    "table.sold": "Sold",
    "table.grossSales": "Gross sales",
    "table.fundTotal": "Fund total",
    "table.payout": "Payout",
    "error.loginRequired": "Please log in first.",
    "error.identityRequired": "Store ID and Producer ID are required.",
  },
  ko: {
    "app.salesReport": "매출 내역 조회",
    "app.switchAccount": "계정 변경",
    "app.language": "언어",
    "app.langEnglish": "영어",
    "app.langKorean": "한국어",
    "login.title": "장부 생산자 포털",
    "login.subtitle": "매출 대시보드를 사용하려면 로그인하세요.",
    "login.storeCode": "매장 코드",
    "login.storeCodePlaceholder": "매장 코드를 입력하세요",
    "login.accountId": "계정 ID",
    "login.accountIdPlaceholder": "계정 ID를 입력하세요",
    "login.submit": "로그인",
    "date.queryPeriod": "조회 기간",
    "date.prevDay": "이전 기간",
    "date.nextDay": "다음 기간",
    "date.pickDate": "날짜 선택",
    "date.cancel": "취소",
    "date.apply": "적용",
    "date.loadSales": "매출 조회",
    "date.loadingReport": "조회 중...",
    "range.today": "일간",
    "range.oneWeek": "주간",
    "range.oneMonth": "월간",
    "range.oneYear": "연간",
    "stats.total": "합계",
    "stats.grossSales": "총 매출",
    "stats.fundTotal": "펀드 합계",
    "stats.payoutAmount": "정산 금액",
    "stats.unitsSold": "판매 수량",
    "report.period": "조회 기간",
    "report.products": "상품 수",
    "report.items": "개",
    "report.session": "세션",
    "report.sessionTemporaryLogin": "임시 로그인 활성화",
    "product.itemsHeading": "판매 항목",
    "product.product": "상품",
    "product.sold": "판매",
    "product.variants": "옵션 수",
    "footer.home": "홈",
    "footer.sales": "매출조회",
    "footer.inventory": "재고관리",
    "footer.settings": "설정",
    "table.variant": "옵션",
    "table.sold": "판매",
    "table.grossSales": "총 매출",
    "table.fundTotal": "펀드 합계",
    "table.payout": "정산",
    "error.loginRequired": "먼저 로그인해 주세요.",
    "error.identityRequired": "매장 코드와 계정 ID는 필수입니다.",
  },
};

export function t(key: MessageKey): string {
  return messages[currentLanguage][key];
}

export function getUILanguage(): UILanguage {
  return currentLanguage;
}

export function setUILanguage(language: UILanguage) {
  currentLanguage = language;
}

export function getUILocale(): string {
  return LOCALE_BY_LANGUAGE[currentLanguage];
}
