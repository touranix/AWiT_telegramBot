import { useState } from 'react';
import { MessageCircle, Plus, Send, CornerDownRight, ChevronDown, ChevronUp } from './ui/simple-icons';
import { Card } from './ui/simple-card';
import { Button } from './ui/simple-button';
import { Textarea } from './ui/simple-textarea';
import { Badge } from './ui/simple-badge';

interface Reply {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  replies: Reply[];
}

interface Answer {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  replies: Reply[];
}

interface Question {
  id: string;
  title: string;
  description: string;
  author: string;
  timestamp: Date;
  answers: Answer[];
  tags: string[];
}

interface QuestionCardProps {
  question: Question;
  onAddAnswer: (questionId: string, answer: string) => void;
  onAddReply: (questionId: string, answerId: string, reply: string, parentReplyId?: string) => void;
  currentUser: string | null;
  hideHeader?: boolean;
}

interface ReplyComponentProps {
  reply: Reply;
  questionId: string;
  answerId: string;
  onAddReply: (questionId: string, answerId: string, reply: string, parentReplyId?: string) => void;
  currentUser: string | null;
  level: number;
}

interface AnswerComponentProps {
  answer: Answer;
  questionId: string;
  onAddReply: (questionId: string, answerId: string, reply: string, parentReplyId?: string) => void;
  currentUser: string | null;
  index: number;
}

function ReplyComponent({ reply, questionId, answerId, onAddReply, currentUser, level }: ReplyComponentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [replyError, setReplyError] = useState('');

  const handleSubmitReply = () => {
    setReplyError('');
    
    if (!currentUser) {
      alert('Войдите в систему, чтобы ответить');
      return;
    }

    if (!newReply.trim()) {
      setReplyError('Ответ не может быть пустым');
      return;
    }

    onAddReply(questionId, answerId, newReply.trim(), reply.id);
    setNewReply('');
    setShowReplyForm(false);
    setReplyError('');
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
    setNewReply('');
    setReplyError('');
  };

  const maxLevel = 2;

  return (
    <div className={`pl-${Math.min(level * 4, 8)} border-l-2 border-gray-700/30`}>
      <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/20">
        <p className="mb-2 text-sm text-gray-300">{reply.text}</p>
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>Автор: {reply.author}</span>
          <span>{new Date(reply.timestamp).toLocaleDateString('ru-RU')}</span>
        </div>
        
        {level < maxLevel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs h-6 px-2 text-gray-500 hover:text-gray-300"
          >
            <CornerDownRight size={12} className="mr-1" />
            {showReplyForm ? 'Отмена' : 'Ответить'}
          </Button>
        )}

        {showReplyForm && (
          <div className="mt-3 space-y-2 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
            <div className="text-xs text-gray-500">
              Отвечает: {currentUser}
            </div>
            <Textarea
              placeholder="Ваш ответ... *"
              value={newReply}
              onChange={(e) => {
                setNewReply(e.target.value);
                if (replyError) setReplyError('');
              }}
              className={`min-h-[60px] text-sm bg-gray-800/50 border-gray-600 focus:border-purple-500 text-white ${
                replyError ? 'border-red-500' : ''
              }`}
            />
            {replyError && (
              <p className="text-xs text-red-400">{replyError}</p>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReply}
                size="sm"
                className="text-xs h-7 bg-purple-600 hover:bg-purple-700"
              >
                <Send size={12} className="mr-1" />
                Отправить
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelReply}
                className="text-xs h-7 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Отмена
              </Button>
            </div>
          </div>
        )}

        {reply.replies.length > 0 && (
          <div className="mt-3 space-y-2">
            {reply.replies.map((nestedReply, index) => (
              <div
                key={nestedReply.id}
                className="opacity-0 translate-x-2 animate-[slideInLeft_0.3s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ReplyComponent
                  reply={nestedReply}
                  questionId={questionId}
                  answerId={answerId}
                  onAddReply={onAddReply}
                  currentUser={currentUser}
                  level={level + 1}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AnswerComponent({ answer, questionId, onAddReply, currentUser, index }: AnswerComponentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [replyError, setReplyError] = useState('');

  const handleSubmitReply = () => {
    setReplyError('');
    
    if (!currentUser) {
      alert('Войдите в систему, чтобы ответить');
      return;
    }

    if (!newReply.trim()) {
      setReplyError('Ответ не может быть пустым');
      return;
    }

    onAddReply(questionId, answer.id, newReply.trim());
    setNewReply('');
    setShowReplyForm(false);
    setReplyError('');
  };

  const handleToggleReplyForm = () => {
    if (!currentUser) {
      alert('Войдите в систему, чтобы ответить');
      return;
    }
    setShowReplyForm(!showReplyForm);
    if (showReplyForm) {
      setNewReply('');
      setReplyError('');
    }
  };

  return (
    <div
      className="space-y-3 opacity-0 -translate-x-5 animate-[slideInLeft_0.3s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="p-4 rounded-lg bg-gray-800/40 border border-gray-700/30 relative">
        <div className="absolute -top-2 -left-2 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {index + 1}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-purple-400">{answer.author}</span>
          <span className="text-xs text-gray-500">{new Date(answer.timestamp).toLocaleDateString('ru-RU')}</span>
        </div>
        
        <p className="mb-3 text-gray-300">{answer.text}</p>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleReplyForm}
          className={`text-xs flex items-center gap-1 border-gray-600 text-gray-300 hover:bg-gray-800 ${!currentUser ? 'opacity-60' : ''}`}
        >
          <CornerDownRight size={12} />
          {showReplyForm ? 'Отмена' : 'Ответить'}
        </Button>

        {showReplyForm && (
          <div className="mt-3 space-y-2 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
            <div className="text-xs text-gray-500">
              Отвечает: {currentUser}
            </div>
            <Textarea
              placeholder="Ваш ответ... *"
              value={newReply}
              onChange={(e) => {
                setNewReply(e.target.value);
                if (replyError) setReplyError('');
              }}
              className={`min-h-[80px] text-sm bg-gray-800/50 border-gray-600 focus:border-purple-500 text-white ${
                replyError ? 'border-red-500' : ''
              }`}
            />
            {replyError && (
              <p className="text-xs text-red-400">{replyError}</p>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReply}
                size="sm"
                className="text-xs h-7 bg-purple-600 hover:bg-purple-700"
              >
                <Send size={12} className="mr-1" />
                Отправить
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleReplyForm}
                className="text-xs h-7 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
      </div>

      {answer.replies.length > 0 && (
        <div className="space-y-2 pl-4">
          {answer.replies.map((reply, replyIndex) => (
            <div
              key={reply.id}
              className="opacity-0 translate-x-2 animate-[slideInLeft_0.3s_ease-out_forwards]"
              style={{ animationDelay: `${(index * 0.1) + (replyIndex * 0.05)}s` }}
            >
              <ReplyComponent
                reply={reply}
                questionId={questionId}
                answerId={answer.id}
                onAddReply={onAddReply}
                currentUser={currentUser}
                level={1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function QuestionCard({ question, onAddAnswer, onAddReply, currentUser, hideHeader = false }: QuestionCardProps) {
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');
  const [showAnswers, setShowAnswers] = useState(false);
  const [answerError, setAnswerError] = useState('');

  const handleSubmitAnswer = () => {
    setAnswerError('');
    
    if (!currentUser) {
      alert('Войдите в систему, чтобы ответить');
      return;
    }

    if (!newAnswer.trim()) {
      setAnswerError('Ответ не может быть пустым');
      return;
    }

    onAddAnswer(question.id, newAnswer.trim());
    setNewAnswer('');
    setShowAnswerForm(false);
    setAnswerError('');
  };

  const handleToggleAnswerForm = () => {
    if (!currentUser) {
      alert('Войдите в систему, чтобы ответить');
      return;
    }
    setShowAnswerForm(!showAnswerForm);
    if (showAnswerForm) {
      setNewAnswer('');
      setAnswerError('');
    }
  };

  const getTotalRepliesCount = (replies: Reply[]): number => {
    return replies.reduce((count, reply) => {
      return count + 1 + getTotalRepliesCount(reply.replies);
    }, 0);
  };

  const totalAnswersCount = question.answers.length + 
    question.answers.reduce((count, answer) => count + getTotalRepliesCount(answer.replies), 0);

  return (
    <div className={hideHeader ? '' : 'opacity-0 translate-y-5 animate-[fadeInUp_0.3s_ease-out_forwards]'}>
      {!hideHeader && (
        <Card className="p-6 bg-gray-900/80 backdrop-blur-xl border-gray-700/50 hover:border-gray-600/50 transition-colors">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-white">{question.title}</h3>
              <p className="text-gray-400 mb-3">{question.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-purple-600/20 text-purple-300 border border-purple-600/30">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Автор: {question.author}</span>
                <span>{new Date(question.timestamp).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className={hideHeader ? 'border-t border-gray-700/50 pt-4' : 'mt-4'}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-200 flex items-center">
            Ответы ({totalAnswersCount})
            {totalAnswersCount > 0 && (
              <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            )}
          </h4>
          
          {totalAnswersCount > 0 && (
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              {showAnswers ? (
                <>
                  Скрыть <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Показать <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </div>
        
        {totalAnswersCount === 0 ? (
          <p className="text-gray-500 text-sm italic mb-4">Пока нет ответов</p>
        ) : (
          <div 
            className={`overflow-hidden transition-all duration-300 ${
              showAnswers ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-4 mb-4 pt-2">
              {question.answers.map((answer, index) => (
                <AnswerComponent
                  key={answer.id}
                  answer={answer}
                  questionId={question.id}
                  onAddReply={onAddReply}
                  currentUser={currentUser}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleAnswerForm}
            className={`flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-800 ${!currentUser ? 'opacity-60' : ''}`}
          >
            <Plus size={16} />
            {showAnswerForm ? 'Отмена' : 'Ответить'}
          </Button>
        </div>

        {showAnswerForm && (
          <div className="space-y-3 border-t border-gray-700/50 pt-4 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
            <div className="text-sm text-gray-500">
              Отвечает: {currentUser}
            </div>
            <Textarea
              placeholder="Напишите ваш ответ... *"
              value={newAnswer}
              onChange={(e) => {
                setNewAnswer(e.target.value);
                if (answerError) setAnswerError('');
              }}
              className={`min-h-[100px] bg-gray-800/50 border-gray-600 focus:border-purple-500 text-white ${
                answerError ? 'border-red-500' : ''
              }`}
            />
            {answerError && (
              <p className="text-sm text-red-400">{answerError}</p>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSubmitAnswer} size="sm" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                <Send size={16} />
                Отправить
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAnswerForm}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}