import React, { useState } from "react";
import "./App.css";

import logoImg from "./assets/logo.png";

interface Scores {
  social: number;
  openness: number;
  thinking: number;
  planning: number;
  stability: number;
}
interface Report {
  personality: string;
  strengths: string[];
  weaknesses: string[];
  relationship_style: string;
  study_style: string;
  stress_pattern: string;
  recommended_environment: string;
}
interface AnalyzeResponse {
  type: string;
  scores: Scores;
  report: Report;
}

type Step = "SURVEY" | "LOADING" | "RESULT";

const QUESTIONS: string[] = Array.from(
  { length: 25 },
  (_, i) => `${i + 1}번째 질문\n2학년 2반이신 경향이 있으십니까?`
);

const ReportCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: React.ReactNode;
}) => (
  <div className="report-item">
    <div className="report-icon">{icon}</div>
    <div>
      <div className="report-text-title">{title}</div>
      <div className="report-text-desc">{description}</div>
    </div>
  </div>
);

const RadarChart = ({ scores }: { scores: Scores }) => {
  const data = [
    { label: "사교성", value: scores.social },
    { label: "개방성", value: scores.openness },
    { label: "사고성", value: scores.thinking },
    { label: "계획성", value: scores.planning },
    { label: "안정성", value: scores.stability },
  ];
  const size = 300,
    center = size / 2,
    radius = 90;

  const getPoint = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const distance = (value / 100) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    };
  };

  const points = data.map((d, i) => getPoint(d.value, i));
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="radar-container">
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        {gridLevels.map((level) => {
          const levelPoints = data.map((_, i) => getPoint(level, i));
          return (
            <polygon
              key={level}
              points={levelPoints.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          );
        })}
        {data.map((_, i) => {
          const p = getPoint(100, i);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={polygonPoints}
          fill="rgba(244, 143, 177, 0.3)"
          stroke="#F48FB1"
          strokeWidth="2"
        />
        {points.map((p, i) => (
          <circle key={`point-${i}`} cx={p.x} cy={p.y} r="4" fill="#F48FB1" />
        ))}
        {data.map((d, i) => {
          const p = getPoint(135, i);
          return (
            <g key={`label-${i}`} transform={`translate(${p.x}, ${p.y})`}>
              <text
                fontSize="14"
                fill="#4b5563"
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight="bold"
              >
                {d.label}
              </text>
              <text
                y="20"
                fontSize="16"
                fill="#111827"
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight="bold"
              >
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function PersonalityTest() {
  const [step, setStep] = useState<Step>("SURVEY");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(25).fill(null)
  );

  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const handleSelectAnswer = (score: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = score;
    setAnswers(updatedAnswers);

    // 선택 시 다음 문항으로 자동 스크롤되는 메커니즘 유지
    setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 250);
  };

  const handleSubmit = async () => {
    // 마지막 문항을 선택 안 했을 수도 있으니 최소한의 체크
    if (answers[currentIndex] === null) {
      alert("마지막 문항의 답변을 선택해주세요!");
      return;
    }

    setStep("LOADING");
    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answers }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setResult(data);
      setStep("RESULT");
    } catch (error) {
      console.error(error);
      alert(
        "서버 연결에 실패했습니다. FastAPI 서버가 켜져 있는지 확인해주세요."
      );
      setStep("SURVEY");
    }
  };

  const [qIndex, qText] = QUESTIONS[currentIndex].split("\n");

  return (
    <div className="container">
      {step === "SURVEY" && (
        <div className="card">
          <div className="logo-container">
            <img src={logoImg} alt="WAD 로고" className="logo-image" />
          </div>

          <div className="question-block">
            <div className="question-idx">{qIndex}</div>
            <div className="question-main">{qText}</div>
          </div>

          <div className="options">
            {[1, 2, 3, 4].map((score) => {
              const isSelected = answers[currentIndex] === score;
              const labels = [
                "매우 그렇지 않다",
                "그렇지 않은 편이다",
                "그런 편이다",
                "매우 그렇다",
              ];

              return (
                <div
                  key={score}
                  className="option"
                  onClick={() => handleSelectAnswer(score)}
                >
                  <button
                    className={`circle-btn ${isSelected ? "selected" : ""}`}
                  />
                  <span className="option-label">{labels[score - 1]}</span>
                </div>
              );
            })}
          </div>

          {/* 오른쪽 하단 버튼 제어 영역 */}
          <div className="nav-right">
            {currentIndex < QUESTIONS.length - 1 ? (
              /* 1~24번째 질문일 때는 다음 문항 버튼 표시 */
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="btn-next"
              >
                다음 문항 →
              </button>
            ) : (
              /* 25번째(마지막) 질문일 때는 결과 확인 버튼으로 고정 (선택 여부 관계없이 유지) */
              <button onClick={handleSubmit} className="btn-next result-btn">
                결과 확인 →
              </button>
            )}
          </div>

          {/* 왼쪽 하단 이전 문항 버튼 제어 영역 */}
          {currentIndex > 0 && (
            <div className="nav-left">
              <button
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="btn-prev"
              >
                ← 이전 문항
              </button>
            </div>
          )}
        </div>
      )}

      {step === "LOADING" && (
        <div className="loading-text">AI가 분석 중입니다...</div>
      )}

      {step === "RESULT" && result && (
        <div className="result-card">
          <div className="result-header">
            <span className="badge">분석 결과</span>
            <p className="desc-type">당신의 성격 유형은</p>
            <h1 className="title-type">{result.type}</h1>
            <p className="desc-type">{result.report.personality}</p>
          </div>
          <RadarChart scores={result.scores} />
          <div className="report-box">
            <div className="report-title">
              <span>🤖</span> AI 분석 리포트
            </div>
            <ReportCard
              icon="⭐"
              title="성격 특징"
              description={result.report.personality}
            />
            <ReportCard
              icon="👍"
              title="강점"
              description={result.report.strengths.join(", ")}
            />
            <ReportCard
              icon="⚠️"
              title="약점"
              description={result.report.weaknesses.join(", ")}
            />
            <ReportCard
              icon="💖"
              title="인간관계 스타일"
              description={result.report.relationship_style}
            />
            <ReportCard
              icon="📖"
              title="학습 스타일"
              description={result.report.study_style}
            />
          </div>
          <div className="action-buttons">
            <button
              onClick={() => {
                setStep("SURVEY");
                setCurrentIndex(0);
                setAnswers(Array(25).fill(null));
              }}
              className="btn-outline"
            >
              ↻ 다시 검사하기
            </button>
            <button className="btn-primary">⌂ 메인으로 돌아가기</button>
          </div>
        </div>
      )}
    </div>
  );
}
