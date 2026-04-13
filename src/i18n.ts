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
  | "app.home"
  | "app.salesReport"
  | "app.buyerMix"
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
  | "date.start"
  | "date.end"
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
  | "footer.buyerMix"
  | "footer.inventory"
  | "footer.settings"
  | "buyerMix.changeVsPrevious"
  | "buyerMix.previousPeriod"
  | "buyerMix.payoutRate"
  | "buyerMix.shareOfPayout"
  | "buyerMix.buyerTypeBreakdown"
  | "buyerMix.buyerType"
  | "buyerMix.topProductsByPayout"
  | "buyerMix.mockDataNote"
  | "buyerMix.bestPayoutQuality"
  | "buyerMix.largestFundDrag"
  | "buyerMix.buyersHeading"
  | "buyerMix.allTypes"
  | "buyerMix.purchasedItems"
  | "buyerMix.fundShort"
  | "buyerMix.fundDeduction"
  | "buyerMix.totalNetSales"
  | "buyerMix.itemizedBreakdown"
  | "home.mockDataNote"
  | "home.periodChange"
  | "home.topProductByPayout"
  | "home.highestFundImpactType"
  | "buyerType.retailer"
  | "buyerType.unregisteredIndividual"
  | "buyerType.unregisteredInstitution"
  | "buyerType.producer"
  | "buyerType.staff"
  | "table.variant"
  | "table.item"
  | "table.sold"
  | "table.grossSales"
  | "table.fundTotal"
  | "table.payout"
  | "error.loginRequired"
  | "error.identityRequired";

const messages: Record<UILanguage, Record<MessageKey, string>> = {
  en: {
    "app.home": "Home overview",
    "app.salesReport": "Sales report",
    "app.buyerMix": "Buyer sales",
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
    "date.start": "Start",
    "date.end": "End",
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
    "footer.buyerMix": "Buyers",
    "footer.inventory": "Inventory",
    "footer.settings": "Settings",
    "buyerMix.changeVsPrevious": "vs previous",
    "buyerMix.previousPeriod": "Previous period",
    "buyerMix.payoutRate": "Payout rate",
    "buyerMix.shareOfPayout": "Payout share",
    "buyerMix.buyerTypeBreakdown": "Buyer type breakdown",
    "buyerMix.buyerType": "Buyer type",
    "buyerMix.topProductsByPayout": "Top products by payout",
    "buyerMix.mockDataNote": "Buyer sales preview data for UX validation",
    "buyerMix.bestPayoutQuality": "Best payout quality",
    "buyerMix.largestFundDrag": "Largest fund drag",
    "buyerMix.buyersHeading": "Buyers",
    "buyerMix.allTypes": "All types",
    "buyerMix.purchasedItems": "Purchased items",
    "buyerMix.fundShort": "Fund",
    "buyerMix.fundDeduction": "Fund total",
    "buyerMix.totalNetSales": "Total net sales",
    "buyerMix.itemizedBreakdown": "Itemized breakdown",
    "home.mockDataNote": "Home uses preview data for UX validation",
    "home.periodChange": "Payout change vs previous",
    "home.topProductByPayout": "Top product by payout",
    "home.highestFundImpactType": "Highest fund impact type",
    "buyerType.retailer": "Retailer",
    "buyerType.unregisteredIndividual": "Unregistered individual",
    "buyerType.unregisteredInstitution": "Unregistered institution",
    "buyerType.producer": "Producer",
    "buyerType.staff": "Staff",
    "table.variant": "Variant",
    "table.item": "Item",
    "table.sold": "Sold",
    "table.grossSales": "Gross sales",
    "table.fundTotal": "Fund total",
    "table.payout": "Payout",
    "error.loginRequired": "Please log in first.",
    "error.identityRequired": "Store ID and Producer ID are required.",
  },
  ko: {
    "app.home": "홈 요약",
    "app.salesReport": "매출 내역 조회",
    "app.buyerMix": "구매자 매출",
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
    "date.start": "시작",
    "date.end": "종료",
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
    "footer.buyerMix": "구매자",
    "footer.inventory": "재고관리",
    "footer.settings": "설정",
    "buyerMix.changeVsPrevious": "전 기간 대비",
    "buyerMix.previousPeriod": "이전 기간",
    "buyerMix.payoutRate": "정산 비율",
    "buyerMix.shareOfPayout": "정산 기여도",
    "buyerMix.buyerTypeBreakdown": "구매자 유형별",
    "buyerMix.buyerType": "구매자 유형",
    "buyerMix.topProductsByPayout": "정산 금액 상위 품목",
    "buyerMix.mockDataNote": "구매자 매출 화면 검증용 예시 데이터",
    "buyerMix.bestPayoutQuality": "정산 효율이 높은 유형",
    "buyerMix.largestFundDrag": "펀드 부담이 큰 유형",
    "buyerMix.buyersHeading": "구매자 목록",
    "buyerMix.allTypes": "전체 유형",
    "buyerMix.purchasedItems": "구매 품목",
    "buyerMix.fundShort": "펀드",
    "buyerMix.fundDeduction": "펀드 합계",
    "buyerMix.totalNetSales": "총 정산 금액",
    "buyerMix.itemizedBreakdown": "품목별 내역",
    "home.mockDataNote": "홈 화면은 검증용 예시 데이터를 사용합니다",
    "home.periodChange": "이전 기간 대비 정산 변화",
    "home.topProductByPayout": "정산 금액 상위 품목",
    "home.highestFundImpactType": "펀드 영향이 큰 유형",
    "buyerType.retailer": "소매",
    "buyerType.unregisteredIndividual": "미등록 개인",
    "buyerType.unregisteredInstitution": "미등록 기관",
    "buyerType.producer": "생산자",
    "buyerType.staff": "직원",
    "table.variant": "옵션",
    "table.item": "품목",
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
