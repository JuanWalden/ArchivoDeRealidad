import React, { useState, useEffect } from 'react';
import { 
  Brain, MessageSquare, Beaker, Archive, AlertTriangle, ChevronRight, 
  Clock, Calendar, TrendingUp, CheckCircle, XCircle, BarChart, Eye, 
  FileText, Award, Zap, Menu, X, Moon, Sun, Download, MessageCircle,
  Target, Trophy, Smartphone, Bell, Wifi
} from 'lucide-react';

const RealityArchiveApp = () => {
  // Estados principales
  const [activePhase, setActivePhase] = useState('symptom');
  const [currentEntry, setCurrentEntry] = useState({
    id: null,
    timestamp: new Date().toISOString(),
    symptom: '',
    bodyPart: '',
    intensity: 5,
    interpretation: '',
    catastrophicWords: [],
    complaint: '',
    experiment: '',
    experimentTime: '',
    prediction: '',
    result: '',
    completed: false
  });
  
  const [entries, setEntries] = useState([]);
  const [showArchive, setShowArchive] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalExperiments: 0,
    completedExperiments: 0,
    predictionAccuracy: 0,
    catastrophicReductions: 0,
    streak: 0,
    avgIntensity: 0
  });

  // Palabras catastróficas
  const catastrophicWords = [
    'terrible', 'horrible', 'fatal', 'muerte', 'infarto', 'embotamiento',
    'bloqueado', 'paralizado', 'insoportable', 'no puedo', 'siempre',
    'nunca', 'permanente', 'incurable', 'grave'
  ];

  // Sistema de logros
  const achievementsList = [
    { id: 'first_experiment', title: 'Primer Experimento', description: 'Has registrado tu primer experimento', icon: '🔬', requirement: 1 },
    { id: 'streak_week', title: 'Semana Activa', description: '7 días consecutivos registrando', icon: '🔥', requirement: 7 },
    { id: 'catastrophic_hunter', title: 'Cazador de Catástrofes', description: 'Has detectado 10 pensamientos catastróficos', icon: '🎯', requirement: 10 },
    { id: 'reality_master', title: 'Maestro de la Realidad', description: '80% de tus predicciones fueron erróneas', icon: '🏆', requirement: 80 },
    { id: 'experiment_veteran', title: 'Veterano Experimental', description: '50 experimentos completados', icon: '🎖️', requirement: 50 }
  ];

  // Cargar datos
  useEffect(() => {
    const savedEntries = localStorage.getItem('realityArchiveEntries');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedAchievements = localStorage.getItem('achievements');
    
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
  }, []);

  // Guardar datos
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('realityArchiveEntries', JSON.stringify(entries));
      calculateStats();
      checkAchievements();
    }
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Calcular estadísticas
  const calculateStats = () => {
    const completed = entries.filter(e => e.completed).length;
    const incorrectPredictions = entries.filter(e => e.completed && e.result !== e.prediction).length;
    const totalIntensity = entries.reduce((sum, e) => sum + e.intensity, 0);
    
    setStats({
      totalExperiments: entries.length,
      completedExperiments: completed,
      predictionAccuracy: completed > 0 ? Math.round((incorrectPredictions / completed) * 100) : 0,
      catastrophicReductions: entries.filter(e => e.catastrophicWords.length > 0).length,
      streak: calculateStreak(),
      avgIntensity: entries.length > 0 ? Math.round(totalIntensity / entries.length) : 0
    });
  };

  // Calcular racha
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Verificar logros
  const checkAchievements = () => {
    const newAchievements = [];
    
    achievementsList.forEach(achievement => {
      if (!achievements.includes(achievement.id)) {
        let earned = false;
        
        switch (achievement.id) {
          case 'first_experiment':
            earned = entries.length >= achievement.requirement;
            break;
          case 'streak_week':
            earned = stats.streak >= achievement.requirement;
            break;
          case 'catastrophic_hunter':
            earned = stats.catastrophicReductions >= achievement.requirement;
            break;
          case 'reality_master':
            earned = stats.predictionAccuracy >= achievement.requirement;
            break;
          case 'experiment_veteran':
            earned = stats.completedExperiments >= achievement.requirement;
            break;
        }
        
        if (earned) {
          newAchievements.push(achievement.id);
          showAchievementNotification(achievement);
        }
      }
    });
    
    if (newAchievements.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievements];
      setAchievements(updatedAchievements);
      localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    }
  };

  // Mostrar notificación de logro
  const showAchievementNotification = (achievement) => {
    // En una app real, esto sería una notificación push
    setTimeout(() => {
      alert(`🎉 ¡Logro desbloqueado!\n${achievement.icon} ${achievement.title}\n${achievement.description}`);
    }, 500);
  };

  // Detectar palabras catastróficas
  const detectCatastrophicWords = (text) => {
    const found = catastrophicWords.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
    setCurrentEntry(prev => ({ ...prev, catastrophicWords: found }));
    return found;
  };

  // Manejar cambios
  const handleFieldChange = (field, value) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
    
    if (field === 'interpretation') {
      detectCatastrophicWords(value);
    }
  };

  // Avanzar fase
  const nextPhase = () => {
    const phases = ['symptom', 'interpretation', 'complaint', 'experiment', 'archive'];
    const currentIndex = phases.indexOf(activePhase);
    if (currentIndex < phases.length - 1) {
      setActivePhase(phases[currentIndex + 1]);
    }
  };

  // Guardar entrada
  const saveEntry = () => {
    const newEntry = {
      ...currentEntry,
      id: Date.now(),
      completed: false
    };
    
    setEntries([newEntry, ...entries]);
    scheduleReminder(newEntry);
    resetForm();
    alert('✅ Experimento guardado. Te recordaré registrar el resultado.');
  };

  // Reset form
  const resetForm = () => {
    setCurrentEntry({
      id: null,
      timestamp: new Date().toISOString(),
      symptom: '',
      bodyPart: '',
      intensity: 5,
      interpretation: '',
      catastrophicWords: [],
      complaint: '',
      experiment: '',
      experimentTime: '',
      prediction: '',
      result: '',
      completed: false
    });
    setActivePhase('symptom');
  };

  // Completar experimento
  const completeExperiment = (id, result) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, result, completed: true } : entry
    ));
  };

  // Programar recordatorio
  const scheduleReminder = (entry) => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const reminderTime = new Date(entry.experimentTime).getTime() - Date.now();
          if (reminderTime > 0) {
            setTimeout(() => {
              new Notification('🧪 Archivo de Realidad', {
                body: `Es hora de realizar tu experimento: ${entry.experiment}`,
                icon: '/favicon.ico'
              });
            }, Math.min(reminderTime, 2147483647)); // Max setTimeout value
          }
        }
      });
    }
  };

  // Obtener entradas similares
  const getSimilarEntries = () => {
    if (!currentEntry.symptom) return [];
    
    return entries.filter(entry => 
      entry.symptom.toLowerCase().includes(currentEntry.symptom.toLowerCase()) ||
      entry.bodyPart === currentEntry.bodyPart
    ).slice(0, 3);
  };

  // Exportar datos
  const exportData = () => {
    const data = {
      entries: entries,
      stats: stats,
      achievements: achievements,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archivo_realidad_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Obtener consejos contextuales
  const getContextualHelp = () => {
    switch (activePhase) {
      case 'symptom':
        return {
          title: 'Registrando Síntomas',
          content: 'Describe únicamente lo que sientes físicamente, sin interpretaciones. Por ejemplo: "presión en el pecho" en lugar de "creo que es un infarto".'
        };
      case 'interpretation':
        return {
          title: 'Analizando Interpretaciones',
          content: 'Este es el momento de ser honesto sobre tus pensamientos automáticos. No los juzgues, solo obsérvalos y regístralos tal como aparecen.'
        };
      case 'complaint':
        return {
          title: 'Queja Productiva',
          content: 'Transforma el "no puedo" en "voy a intentar". Una queja productiva reconoce el malestar pero se enfoca en la acción posible.'
        };
      case 'experiment':
        return {
          title: 'Diseñando Experimentos',
          content: 'Sé específico y realista. Un buen experimento es algo que puedes hacer aunque tengas el síntoma. No busques eliminar la ansiedad, sino probar si tus predicciones son ciertas.'
        };
      default:
        return {
          title: 'Archivo de Realidad',
          content: 'Esta herramienta te ayuda a transformar síntomas físicos en experimentos científicos para desafiar pensamientos catastróficos.'
        };
    }
  };

  const themeClasses = darkMode ? 'dark' : '';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50'
    } ${themeClasses}`}>
      
      {/* Header Responsive */}
      <header className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo y título */}
            <div className="flex items-center space-x-3">
              <Archive className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className="hidden sm:block">
                <h1 className={`text-xl lg:text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Archivo de Realidad
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Regulación Emocional • Juan Orta
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Archivo
                </h1>
              </div>
            </div>

            {/* Controles desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button
                onClick={() => setShowHelp(!showHelp)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-purple-400 hover:bg-gray-600' 
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                <MessageCircle size={20} />
              </button>

              <button
                onClick={exportData}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-green-400 hover:bg-gray-600' 
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                <Download size={20} />
              </button>

              <button
                onClick={() => setShowArchive(!showArchive)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                  darkMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <FileText size={20} />
                <span>{showArchive ? 'Nuevo' : 'Archivo'}</span>
              </button>
            </div>

            {/* Menú móvil */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'text-white' : 'text-gray-600'
                }`}
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {showMobileMenu && (
            <div className={`md:hidden border-t ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <div className="py-4 space-y-2">
                <button
                  onClick={() => {
                    setShowArchive(!showArchive);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors flex items-center space-x-3 ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText size={20} />
                  <span>{showArchive ? 'Nuevo Registro' : 'Ver Archivo'}</span>
                </button>
                
                <button
                  onClick={() => {
                    setDarkMode(!darkMode);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors flex items-center space-x-3 ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  <span>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowHelp(!showHelp);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors flex items-center space-x-3 ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageCircle size={20} />
                  <span>Ayuda</span>
                </button>

                <button
                  onClick={() => {
                    exportData();
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors flex items-center space-x-3 ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Download size={20} />
                  <span>Exportar Datos</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Chat de ayuda contextual */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`w-full max-w-md rounded-t-xl sm:rounded-xl shadow-2xl transform transition-all ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  💡 Ayuda Contextual
                </h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className={`p-1 rounded-lg ${
                    darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {getContextualHelp().title}
              </h4>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {getContextualHelp().content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Barra de progreso responsive */}
      {!showArchive && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 lg:mt-6">
          <div className={`rounded-lg shadow-md p-4 lg:p-6 transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            
            {/* Indicadores de fase - versión móvil */}
            <div className="sm:hidden mb-4">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Paso {['symptom', 'interpretation', 'complaint', 'experiment', 'archive'].indexOf(activePhase) + 1} de 5
                </span>
                <span className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {Math.round(((['symptom', 'interpretation', 'complaint', 'experiment', 'archive'].indexOf(activePhase) + 1) / 5) * 100)}%
                </span>
              </div>
              <div className={`w-full h-2 rounded-full mt-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((['symptom', 'interpretation', 'complaint', 'experiment', 'archive'].indexOf(activePhase) + 1) / 5) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Indicadores de fase - versión desktop */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-between mb-4">
                {['symptom', 'interpretation', 'complaint', 'experiment', 'archive'].map((phase, index) => (
                  <div key={phase} className="flex items-center">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      activePhase === phase 
                        ? 'bg-blue-600 text-white scale-110 shadow-lg' :
                      index < ['symptom', 'interpretation', 'complaint', 'experiment', 'archive'].indexOf(activePhase) 
                        ? 'bg-green-500 text-white shadow-md' 
                        : darkMode 
                          ? 'bg-gray-700 text-gray-400' 
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    {index < 4 && (
                      <div className={`flex-1 h-1 mx-2 lg:mx-4 rounded-full transition-colors ${
                        index < ['symptom', 'interpretation', 'complaint', 'experiment', 'archive'].indexOf(activePhase)
                          ? 'bg-green-500'
                          : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2 text-xs text-center">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Síntoma</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Interpretación</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Queja</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Experimento</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Archivo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 lg:mt-6 pb-20">
        {!showArchive ? (
          <div className={`rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 transition-colors ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            
            {/* Fase 1: Síntoma */}
            {activePhase === 'symptom' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="text-red-500 w-8 h-8 lg:w-10 lg:h-10" />
                  <h2 className={`text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    ¿Qué síntoma notas?
                  </h2>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Describe SOLO lo que sientes (sin interpretaciones)
                  </label>
                  <input
                    type="text"
                    value={currentEntry.symptom}
                    onChange={(e) => handleFieldChange('symptom', e.target.value)}
                    className={`w-full px-4 py-3 lg:py-4 border-2 rounded-lg focus:outline-none text-base lg:text-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    placeholder="Ej: Presión en el pecho, dolor en la cabeza..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ¿En qué parte del cuerpo?
                  </label>
                  <select
                    value={currentEntry.bodyPart}
                    onChange={(e) => handleFieldChange('bodyPart', e.target.value)}
                    className={`w-full px-4 py-3 lg:py-4 border-2 rounded-lg focus:outline-none transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                  >
                    <option value="">Selecciona...</option>
                    <option value="cabeza">Cabeza</option>
                    <option value="pecho">Pecho</option>
                    <option value="estomago">Estómago</option>
                    <option value="espalda">Espalda</option>
                    <option value="extremidades">Extremidades</option>
                    <option value="general">General/Todo el cuerpo</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Intensidad (1-10)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentEntry.intensity}
                      onChange={(e) => handleFieldChange('intensity', Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className={`text-2xl lg:text-3xl font-bold w-12 lg:w-16 text-center ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {currentEntry.intensity}
                    </span>
                  </div>
                </div>

                {/* Entradas similares */}
                {getSimilarEntries().length > 0 && (
                  <div className={`rounded-lg p-4 ${
                    darkMode ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <h3 className={`font-semibold mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                      📋 Ya has experimentado síntomas similares:
                    </h3>
                    <div className="space-y-2">
                      {getSimilarEntries().map(entry => (
                        <div key={entry.id} className={`text-sm p-2 rounded ${
                          darkMode ? 'bg-blue-800/30' : 'bg-blue-100'
                        }`}>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {entry.symptom}
                          </span>
                          <span className={`ml-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                            → Experimento realizado
                          </span>
                          {entry.completed && (
                            <span className={`ml-2 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                              ✓ Sin consecuencias
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={nextPhase}
                  disabled={!currentEntry.symptom || !currentEntry.bodyPart}
                  className="w-full py-3 lg:py-4 bg-blue-600 text-white rounded-lg font-semibold text-base lg:text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  Siguiente: Interpretación →
                </button>
              </div>
            )}

            {/* Fase 2: Interpretación */}
            {activePhase === 'interpretation' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="text-orange-500 w-8 h-8 lg:w-10 lg:h-10" />
                  <h2 className={`text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    ¿Qué crees que significa?
                  </h2>
                </div>

                <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Tu síntoma:</strong> {currentEntry.symptom} en {currentEntry.bodyPart} 
                    (intensidad: {currentEntry.intensity}/10)
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Escribe tu interpretación (lo que crees que significa este síntoma)
                  </label>
                  <textarea
                    value={currentEntry.interpretation}
                    onChange={(e) => handleFieldChange('interpretation', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    rows="4"
                    placeholder="Ej: Creo que es algo grave, podría ser un infarto..."
                  />
                </div>

                {/* Detector de catastrofismo mejorado */}
                {currentEntry.catastrophicWords.length > 0 && (
                  <div className={`border-2 rounded-lg p-4 ${
                    darkMode 
                      ? 'bg-red-900/50 border-red-700' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <h3 className={`font-semibold mb-3 flex items-center gap-2 ${
                      darkMode ? 'text-red-300' : 'text-red-800'
                    }`}>
                      <Zap className="text-red-500" size={20} />
                      Detector de Catastrofismo Activado
                    </h3>
                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Has usado palabras que amplifican el miedo:
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {currentEntry.catastrophicWords.map(word => (
                        <span key={word} className={`px-3 py-1 rounded-full text-sm font-medium ${
                          darkMode 
                            ? 'bg-red-800 text-red-200' 
                            : 'bg-red-200 text-red-800'
                        }`}>
                          {word}
                        </span>
                      ))}
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-800/30' : 'bg-red-100'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        💡 <strong>Sugerencia:</strong> Intenta describir los hechos sin juicios: ¿Qué sientes exactamente sin interpretarlo?
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={nextPhase}
                  disabled={!currentEntry.interpretation}
                  className="w-full py-3 lg:py-4 bg-blue-600 text-white rounded-lg font-semibold text-base lg:text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  Siguiente: Transformar en Queja Productiva →
                </button>
              </div>
            )}

            {/* Fase 3: Queja Productiva */}
            {activePhase === 'complaint' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="text-purple-500 w-8 h-8 lg:w-10 lg:h-10" />
                  <h2 className={`text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Queja Productiva
                  </h2>
                </div>

                <div className={`rounded-lg p-4 ${
                  darkMode ? 'bg-purple-900/50 border border-purple-700' : 'bg-purple-50 border border-purple-200'
                }`}>
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    En lugar de quejarte sin objetivo, vamos a convertir tu preocupación en algo útil.
                  </p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                    Una queja productiva reconoce el malestar pero se enfoca en la acción.
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Completa: "Me siento mal porque {currentEntry.symptom}, PERO VOY A..."
                  </label>
                  <textarea
                    value={currentEntry.complaint}
                    onChange={(e) => handleFieldChange('complaint', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    rows="3"
                    placeholder="Ej: ...pero voy a salir a caminar como tenía planeado y observar qué pasa"
                  />
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="text-center p-4">
                    <div className="text-4xl mb-3">😰</div>
                    <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                      Queja Improductiva
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      "No puedo hacer nada"
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl mb-3">💪</div>
                    <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                      Queja Productiva
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      "Siento X pero haré Y"
                    </p>
                  </div>
                </div>

                <button
                  onClick={nextPhase}
                  disabled={!currentEntry.complaint}
                  className="w-full py-3 lg:py-4 bg-blue-600 text-white rounded-lg font-semibold text-base lg:text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  Siguiente: Diseñar Experimento →
                </button>
              </div>
            )}

            {/* Fase 4: Experimento */}
            {activePhase === 'experiment' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Beaker className="text-green-500 w-8 h-8 lg:w-10 lg:h-10" />
                  <h2 className={`text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Diseña tu Experimento
                  </h2>
                </div>

                <div className={`rounded-lg p-4 ${
                  darkMode ? 'bg-green-900/50 border border-green-700' : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="space-y-2">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>Tu hipótesis catastrófica:</strong> "{currentEntry.interpretation}"
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>Tu decisión:</strong> "{currentEntry.complaint}"
                    </p>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                      Ahora vamos a ponerlo a prueba científicamente.
                    </p>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ¿Qué actividad específica vas a hacer para probar tu hipótesis?
                  </label>
                  <input
                    type="text"
                    value={currentEntry.experiment}
                    onChange={(e) => handleFieldChange('experiment', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    placeholder="Ej: Ir al supermercado durante 30 minutos"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ¿Cuándo lo harás?
                  </label>
                  <input
                    type="datetime-local"
                    value={currentEntry.experimentTime}
                    onChange={(e) => handleFieldChange('experimentTime', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Predicción: ¿Qué crees que pasará? (Sé específico)
                  </label>
                  <textarea
                    value={currentEntry.prediction}
                    onChange={(e) => handleFieldChange('prediction', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    rows="3"
                    placeholder="Ej: Me marearé y tendré que salir corriendo del supermercado"
                  />
                </div>

                <div className={`rounded-lg p-4 ${
                  darkMode ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    🔬 Reglas del Experimento Científico:
                  </h3>
                  <ul className={`text-sm space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Debes completar la actividad aunque sientas el síntoma</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Observa objetivamente qué sucede (sin interpretar)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Registra el resultado real, no lo que temías</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Recuerda: es un experimento, no una prueba de valentía</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={nextPhase}
                  disabled={!currentEntry.experiment || !currentEntry.experimentTime || !currentEntry.prediction}
                  className="w-full py-3 lg:py-4 bg-blue-600 text-white rounded-lg font-semibold text-base lg:text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  Siguiente: Guardar en el Archivo →
                </button>
              </div>
            )}

            {/* Fase 5: Archivo */}
            {activePhase === 'archive' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Archive className="text-indigo-500 w-8 h-8 lg:w-10 lg:h-10" />
                  <h2 className={`text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Resumen del Experimento
                  </h2>
                </div>

                <div className={`rounded-lg p-6 space-y-4 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700' 
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                }`}>
                  {[
                    { label: 'Síntoma', value: `${currentEntry.symptom} (${currentEntry.intensity}/10)`, icon: '🔍' },
                    { label: 'Tu Interpretación', value: currentEntry.interpretation, icon: '🧠', extra: currentEntry.catastrophicWords.length > 0 && `⚠️ Contiene ${currentEntry.catastrophicWords.length} palabras catastróficas` },
                    { label: 'Queja Productiva', value: currentEntry.complaint, icon: '💪' },
                    { label: 'Experimento', value: `${currentEntry.experiment}\n📅 ${new Date(currentEntry.experimentTime).toLocaleString('es-ES')}`, icon: '🔬' },
                    { label: 'Tu Predicción', value: currentEntry.prediction, icon: '🔮' }
                  ].map((item, index) => (
                    <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-black/20' : 'bg-white/50'}`}>
                      <p className={`text-xs uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.icon} {item.label}
                      </p>
                      <p className={`font-semibold whitespace-pre-line ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {item.value}
                      </p>
                      {item.extra && (
                        <p className={`text-sm mt-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                          {item.extra}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className={`border-2 rounded-lg p-4 ${
                  darkMode 
                    ? 'bg-yellow-900/50 border-yellow-700' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <Bell className={`w-6 h-6 mt-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <div>
                      <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                        📱 Sistema de Recordatorios Activado
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Recibirás una notificación para registrar el resultado después de tu experimento.
                        También te enviaremos recordatorios de seguimiento para mantener tu progreso.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={saveEntry}
                  className="w-full py-3 lg:py-4 bg-green-600 text-white rounded-lg font-semibold text-base lg:text-lg hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <Archive size={20} />
                  Guardar Experimento en el Archivo
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Vista del Archivo Mejorada */
          <div className="space-y-6">
            
            {/* Estadísticas mejoradas */}
            <div className={`rounded-lg shadow-lg p-6 transition-colors ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-xl lg:text-2xl font-bold mb-6 flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <BarChart className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                Tu Progreso en Números
              </h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { value: stats.totalExperiments, label: 'Experimentos Totales', color: 'blue', icon: <Beaker size={24} /> },
                  { value: stats.completedExperiments, label: 'Completados', color: 'green', icon: <CheckCircle size={24} /> },
                  { value: `${stats.predictionAccuracy}%`, label: 'Predicciones Erróneas', color: 'purple', icon: <Target size={24} /> },
                  { value: stats.catastrophicReductions, label: 'Catastrofismos Detectados', color: 'orange', icon: <Zap size={24} /> }
                ].map((stat, index) => (
                  <div key={index} className={`text-center p-4 rounded-lg transition-transform hover:scale-105 ${
                    darkMode 
                      ? `bg-${stat.color}-900/50 border border-${stat.color}-700` 
                      : `bg-${stat.color}-50 border border-${stat.color}-200`
                  }`}>
                    <div className={`flex justify-center mb-2 ${
                      darkMode ? `text-${stat.color}-400` : `text-${stat.color}-600`
                    }`}>
                      {stat.icon}
                    </div>
                    <div className={`text-2xl lg:text-3xl font-bold mb-1 ${
                      darkMode ? `text-${stat.color}-400` : `text-${stat.color}-600`
                    }`}>
                      {stat.value}
                    </div>
                    <div className={`text-xs lg:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Logros desbloqueados */}
              {achievements.length > 0 && (
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-yellow-900/50 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <h3 className={`font-semibold mb-3 flex items-center gap-2 ${
                    darkMode ? 'text-yellow-300' : 'text-yellow-800'
                  }`}>
                    <Trophy size={20} />
                    Logros Desbloqueados ({achievements.length}/{achievementsList.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {achievementsList.map(achievement => (
                      <div
                        key={achievement.id}
                        className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${
                          achievements.includes(achievement.id)
                            ? darkMode 
                              ? 'bg-yellow-800 text-yellow-200 border border-yellow-600' 
                              : 'bg-yellow-200 text-yellow-800 border border-yellow-300'
                            : darkMode
                              ? 'bg-gray-700 text-gray-500 border border-gray-600'
                              : 'bg-gray-200 text-gray-500 border border-gray-300'
                        }`}
                      >
                        {achievement.icon} {achievement.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensaje de logro importante */}
              {stats.predictionAccuracy > 70 && (
                <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
                  darkMode 
                    ? 'bg-green-900/50 border border-green-700' 
                    : 'bg-green-100 border border-green-200'
                }`}>
                  <Award className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <p className={`font-semibold mb-1 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                      ¡Descubrimiento importante!
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      El {stats.predictionAccuracy}% de tus predicciones catastróficas NO se cumplieron.
                      Tu mente te engaña más de lo que acierta.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Lista de experimentos mejorada */}
            <div className={`rounded-lg shadow-lg p-6 transition-colors ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-xl lg:text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📚 Archivo de Experimentos
              </h2>

              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🗄️</div>
                  <p className={`text-lg mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tu archivo está vacío
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Comienza registrando tu primer experimento para transformar síntomas en ciencia
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map(entry => (
                    <div key={entry.id} className={`border-2 rounded-lg p-4 lg:p-6 transition-all hover:shadow-md ${
                      entry.completed 
                        ? darkMode 
                          ? 'border-green-700 bg-green-900/20' 
                          : 'border-green-200 bg-green-50'
                        : darkMode 
                          ? 'border-yellow-700 bg-yellow-900/20' 
                          : 'border-yellow-200 bg-yellow-50'
                    }`}>
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Brain className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={20} />
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {entry.symptom} ({entry.intensity}/10)
                            </span>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {new Date(entry.timestamp).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className="font-medium">Interpretación:</span> {entry.interpretation}
                          </div>

                          {entry.catastrophicWords.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {entry.catastrophicWords.map(word => (
                                <span key={word} className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  darkMode 
                                    ? 'bg-red-800 text-red-200' 
                                    : 'bg-red-200 text-red-800'
                                }`}>
                                  {word}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className="font-medium">Experimento:</span> {entry.experiment}
                            <div className="text-xs mt-1 flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(entry.experimentTime).toLocaleString('es-ES')}
                            </div>
                          </div>

                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                            <div className="space-y-2">
                              <p className={`text-sm ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                <strong>Predijiste:</strong> {entry.prediction}
                              </p>
                              {entry.completed && (
                                <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                  <strong>Realidad:</strong> {entry.result}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex lg:flex-col items-center gap-2">
                          {entry.completed ? (
                            <div className="text-center">
                              <CheckCircle className={`w-8 h-8 mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                              <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                Completado
                              </span>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Clock className={`w-8 h-8 mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                              <button
                                onClick={() => {
                                  const result = prompt('¿Qué pasó realmente durante tu experimento?');
                                  if (result) completeExperiment(entry.id, result);
                                }}
                                className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                                  darkMode 
                                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                                }`}
                              >
                                Registrar Resultado
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button mejorado */}
      {showArchive && entries.some(e => !e.completed) && (
        <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-40">
          <div className={`px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105 ${
            darkMode 
              ? 'bg-red-600 text-white border border-red-500' 
              : 'bg-red-600 text-white'
          }`}>
            <Clock size={20} />
            <span className="font-medium text-sm lg:text-base">
              {entries.filter(e => !e.completed).length} pendientes
            </span>
          </div>
        </div>
      )}

      {/* Botón de ayuda flotante */}
      <button
        onClick={() => setShowHelp(true)}
        className={`fixed bottom-4 left-4 lg:bottom-6 lg:left-6 w-12 h-12 lg:w-14 lg:h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-40 ${
          darkMode 
            ? 'bg-purple-600 text-white hover:bg-purple-700' 
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        <MessageCircle size={20} />
      </button>
    </div>
  );
};

export default RealityArchiveApp;