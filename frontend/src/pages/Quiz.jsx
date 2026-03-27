import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getQuestions, getAnswers, submitResult } from '../services/api';
import useGameStore from '../store';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import OptionButton from '../components/OptionButton';
import SkeletonLoader from '../components/SkeletonLoader';

const QUESTION_TIME = 30;

export default function Quiz() {
  const navigate = useNavigate();
  const {
    participant, questions, setQuestions,
    currentIndex, nextQuestion,
    startQuiz, finishQuiz,
    recordAnswer, answers,
    setResults,
  } = useGameStore();

  const [loading, setLoading]             = useState(true);
  const [selectedIdx, setSelectedIdx]     = useState(null);
  const [revealed, setRevealed]           = useState(false);
  const [correctIdx, setCorrectIdx]       = useState(null);
  const [timerReset, setTimerReset]       = useState(0);
  const [timerRunning, setTimerRunning]   = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  useEffect(() => { if (!participant) navigate('/register'); }, [participant]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getQuestions();
        if (!Array.isArray(data) || data.length === 0) throw new Error('empty');
        setQuestions(data);
      } catch {
        toast.error('Could not load questions — is the API running?');
        setQuestions([
          { QnId:1, QnInWords:'What is the capital of France?',        ImageName:null, Options:['Berlin','Paris','Madrid','Rome']              },
          { QnId:2, QnInWords:'Which planet is closest to the Sun?',   ImageName:null, Options:['Venus','Earth','Mercury','Mars']              },
          { QnId:3, QnInWords:'What is 2 + 2 × 2?',                   ImageName:null, Options:['8','6','4','10']                              },
          { QnId:4, QnInWords:'Who wrote Romeo and Juliet?',           ImageName:null, Options:['Dickens','Shakespeare','Twain','Austen']      },
          { QnId:5, QnInWords:'Which is the largest ocean on Earth?',  ImageName:null, Options:['Atlantic','Indian','Arctic','Pacific']        },
        ]);
      } finally {
        startQuiz();
        setTimerRunning(true);
        setLoading(false);
      }
    };
    load();
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleSelect = useCallback(async (optionIndex) => {
    if (revealed || transitioning || !currentQuestion) return;
    setSelectedIdx(optionIndex);
    setTimerRunning(false);
    recordAnswer(currentQuestion.QnId, optionIndex);

    // Fetch correct answer for THIS question from backend
    let correctZeroIdx = null;
    try {
      const answersData = await getAnswers([currentQuestion.QnId]);
      // answersData: [{ QnId, Answer (1-based int 1-4), Options, QnInWords, ImageName }]
      const match = Array.isArray(answersData)
        ? answersData.find((a) => a.QnId === currentQuestion.QnId)
        : null;
      if (match?.Answer != null) correctZeroIdx = match.Answer - 1; // convert to 0-based
    } catch {}

    setCorrectIdx(correctZeroIdx);
    setRevealed(true);
    setTimeout(() => advance(), 900);
  }, [revealed, transitioning, currentQuestion]);

  const handleTimeUp = useCallback(() => {
    if (revealed) return;
    setTimerRunning(false);
    setRevealed(true);
    if (currentQuestion) recordAnswer(currentQuestion.QnId, null);
    toast("⏰ Time's up!", { icon: '⏱️' });
    setTimeout(() => advance(), 800);
  }, [revealed, currentQuestion]);

  const advance = () => {
    setTransitioning(true);
    setTimeout(async () => {
      const idx = currentIndexRef.current;
      const qs  = useGameStore.getState().questions;
      if (idx >= qs.length - 1) { await finishAll(); return; }
      nextQuestion();
      setSelectedIdx(null);
      setRevealed(false);
      setCorrectIdx(null);
      setTimerReset((r) => r + 1);
      setTimerRunning(true);
      setTransitioning(false);
    }, 350);
  };

  const finishAll = async () => {
    finishQuiz();
    const timeTaken  = useGameStore.getState().getTimeTaken();
    const allAnswers = useGameStore.getState().answers; // [{ qnId, selectedIndex }]
    const qs         = useGameStore.getState().questions;

    // Fetch correct answers for ALL questions at once
    const realIds = qs.map((q) => q.QnId).filter((id) => id > 0);
    let scoreData = [];
    try {
      if (realIds.length > 0) scoreData = await getAnswers(realIds);
    } catch {}

    // Calculate score
    // Backend Answer field: 1-based integer pointing to correct option
    let score = 0;
    const breakdown = qs.map((q) => {
      const given   = allAnswers.find((a) => a.qnId === q.QnId);
      const correct = Array.isArray(scoreData)
        ? scoreData.find((s) => s.QnId === q.QnId)
        : null;
      const correctIndex = correct?.Answer != null ? correct.Answer - 1 : null;
      const isCorrect =
        given?.selectedIndex != null &&
        correctIndex != null &&
        given.selectedIndex === correctIndex;
      if (isCorrect) score++;
      return {
        qnId: q.QnId,
        questionText: q.QnInWords,
        correct: isCorrect,
        selectedIndex: given?.selectedIndex ?? null,
        correctIndex,
      };
    });

    setResults({ score, total: qs.length, timeTaken, breakdown });

    // PUT /api/Participant/{id}  body: { ParticipantId, Score, TimeTaken }
    const pid = participant?.ParticipantId;
    if (pid) {
      try { await submitResult(pid, score, timeTaken); } catch {}
    }

    navigate('/result');
  };

  if (loading || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #0d0030 0%, #050510 60%)' }}>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d0030 0%, #050510 50%, #00100a 100%)' }}>
      <div className="noise-overlay" />

      {/* TOP BAR */}
      <div className="sticky top-0 z-20 px-4 md:px-8 py-4"
        style={{ background:'rgba(5,5,16,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Timer duration={QUESTION_TIME} onTimeUp={handleTimeUp} running={timerRunning} reset={timerReset} />
          <ProgressBar current={currentIndex + 1} total={questions.length} />
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-xl">{participant?.avatar || '👤'}</span>
            <span className="text-white/70 text-sm font-body hidden sm:block max-w-[80px] truncate">
              {participant?.Name}
            </span>
          </div>
        </div>
      </div>

      {/* QUESTION + OPTIONS */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-5">
          <AnimatePresence mode="wait">
            <QuestionCard key={currentIndex} question={currentQuestion} index={currentIndex} total={questions.length} />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div key={`opts-${currentIndex}`} className="grid grid-cols-1 gap-3"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              {currentQuestion.Options.map((opt, idx) => (
                <OptionButton
                  key={idx}
                  text={opt}
                  index={idx}
                  selected={selectedIdx === idx}
                  correct={revealed && correctIdx === idx}
                  wrong={revealed && selectedIdx === idx && correctIdx !== idx}
                  disabled={revealed || transitioning}
                  onClick={handleSelect}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {!revealed && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex justify-center mt-2">
              <button onClick={handleTimeUp} className="text-white/30 hover:text-white/60 text-sm font-body transition-colors">
                Skip question →
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
