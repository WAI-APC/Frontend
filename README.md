# 🎨 AI Frontend (APC_WAI)

FastAPI 백엔드와 연동하여 사용자의 성격을 분석하고 시각화해 주는 웹 서비스 프론트엔드입니다. 
25개의 설문 문항을 제공하며, Upstage LLM이 생성한 구조화된 성격 리포트를 사용자에게 직관적이고 아름다운 UI로 전달합니다.

---

## 🚀 주요 기능

* **인터랙티브 설문 UI:** 사용자 경험을 고려한 25문항 성격 검사 페이지
* **성향 점수 시각화:** 5가지 성향(`social`, `openness`, `thinking`, `planning`, `stability`)을 레이더 차트 등으로 한눈에 확인
* **맞춤형 리포트 대시보드:** AI가 분석한 개인 맞춤형 리포트(강점, 약점, 연애/학업 스타일 등)를 컴포넌트화하여 제공
* **반응형 웹 디자인:** 모바일과 데스크톱 환경 모두에 최적화된 UX 제공

---

## 🛠️ 기술 스택

* **Framework:** React 18 (Vite)
* **Styling:** Tailwind CSS
* **State Management / Data Fetching:** Axios / TanStack Query (React Query)
* **Visualization:** Recharts

---

## 📁 프로젝트 구조

```text
APC_WAI_FE/
├── src/
│   ├── assets/          # 이미지 및 아이콘 자원
│   ├── components/      # 공통 재사용 컴포넌트 (버튼, 레이아웃 등)
│   ├── features/        # 기능별 페이지/컴포넌트 (Survey, Result 등)
│   │   ├── survey/      # 설문조사 진행 관련 컴포넌트
│   │   └── result/      # 결과 리포트 및 차트 시각화 컴포넌트
│   ├── services/        # API 요청 관리 (api.js / axios 인스턴스)
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── README.md
