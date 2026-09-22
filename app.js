(() => {
  const supabaseClient = window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY
    ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
    : null;
  const STORAGE_KEYS = {
    state: 'stillpoint-state-v1',
    accounts: 'stillpoint-accounts-v1',
    session: 'stillpoint-session-v1',
    language: 'stillpoint-language-v1'
  };

  const moodMeta = [
    { key: 'radiant', icon: '☀', label: 'Radiant', color: 'bg-amber-50 text-amber-700' },
    { key: 'calm', icon: '☁', label: 'Calm', color: 'bg-emerald-50 text-emerald-700' },
    { key: 'anxious', icon: '〰', label: 'Anxious', color: 'bg-indigo-50 text-indigo-700' },
    { key: 'down', icon: '◒', label: 'Down', color: 'bg-blue-50 text-blue-700' },
    { key: 'overwhelmed', icon: '≋', label: 'Overwhelmed', color: 'bg-rose-50 text-rose-700' }
  ];

  const authReasonOptions = {
    pt: ['Cuidar melhor das minhas emoções', 'Lidar com ansiedade ou stress', 'Melhorar o meu foco e estudo', 'Criar hábitos mais saudáveis', 'Ter um espaço para refletir'],
    en: ['Care for my emotions', 'Manage anxiety or stress', 'Improve my focus and study', 'Build healthier habits', 'Have a space to reflect'],
    es: ['Cuidar mejor mis emociones', 'Manejar la ansiedad o el estrés', 'Mejorar mi concentración y estudio', 'Crear hábitos más saludables', 'Tener un espacio para reflexionar'],
    fr: ['Mieux prendre soin de mes émotions', 'Gérer l’anxiété ou le stress', 'Améliorer ma concentration et mes études', 'Créer des habitudes plus saines', 'Avoir un espace pour réfléchir'],
    de: ['Meine Gefühle besser versorgen', 'Angst oder Stress bewältigen', 'Fokus und Lernen verbessern', 'Gesündere Gewohnheiten aufbauen', 'Einen Raum zum Reflektieren haben'],
    ts: ['Ku hlayisa matitwelo ya mina', 'Ku lawula ku vilela kumbe ntshikilelo', 'Ku antswisa ku kongomisa ni dyondzo', 'Ku aka mikhuva leyinene', 'Ku va ni ndhawu yo ehleketa'],
    mkh: ['Kusamalira maganizo anga', 'Kuthana ndi nkhawa kapena nkhawa', 'Kuwongolera kuganizira ndi kuphunzira', 'Kupanga zizolowezi zabwino', 'Kukhala ndi malo oganizira'],
    sn: ['Kuchengeta manzwiro angu', 'Kugadzirisa kufunganya kana kushushikana', 'Kuvandudza kutarisa nekudzidza', 'Kuvaka tsika dzine hutano', 'Kuva nenzvimbo yekufungisisa']
  };

  const timeGreetingTranslations = {
    pt: { morning: 'Bom dia, amigo.', afternoon: 'Boa tarde, amigo.', evening: 'Boa noite, amigo.' },
    en: { morning: 'Good morning, friend.', afternoon: 'Good afternoon, friend.', evening: 'Good evening, friend.' },
    es: { morning: 'Buenos días, amigo.', afternoon: 'Buenas tardes, amigo.', evening: 'Buenas noches, amigo.' },
    fr: { morning: 'Bonjour, ami.', afternoon: 'Bon après-midi, ami.', evening: 'Bonsoir, ami.' },
    de: { morning: 'Guten Morgen, Freund.', afternoon: 'Guten Tag, Freund.', evening: 'Guten Abend, Freund.' },
    ts: { morning: 'Avuxeni, munghana.', afternoon: 'Ndzenghunghu, munghana.', evening: 'Aupelene, munghana.' },
    mkh: { morning: 'Mwau, mnzanga.', afternoon: 'Mwaswera bwanji, mnzanga.', evening: 'Madzulo abwino, mnzanga.' },
    sn: { morning: 'Mhoroi shamwari.', afternoon: 'Masikati akanaka, shamwari.', evening: 'Manheru akanaka, shamwari.' }
  };

  const reportTranslations = {
    pt: { header: 'Relatório pessoal de bem-estar', generated: 'Gerado', checkins: 'Check-ins', tasks: 'Tarefas concluídas', friends: 'Amigos', moodSummary: 'Resumo do humor', recent: 'Reflexões recentes', quiet: 'Reflexão tranquila', next: 'Próximo passo gentil: faça uma pequena ação e permita-se descansar.' },
    en: { header: 'Personal Wellness Report', generated: 'Generated', checkins: 'Check-ins', tasks: 'Tasks completed', friends: 'Friends', moodSummary: 'Mood summary', recent: 'Recent reflections', quiet: 'Quiet reflection', next: 'Gentle next step: take one small action and give yourself permission to rest.' },
    es: { header: 'Informe personal de bienestar', generated: 'Generado', checkins: 'Registros', tasks: 'Tareas completadas', friends: 'Amigos', moodSummary: 'Resumen del ánimo', recent: 'Reflexiones recientes', quiet: 'Reflexión tranquila', next: 'Siguiente paso amable: haz una pequeña acción y permítete descansar.' },
    fr: { header: 'Rapport personnel de bien-être', generated: 'Généré', checkins: 'Check-ins', tasks: 'Tâches terminées', friends: 'Amis', moodSummary: 'Résumé de l’humeur', recent: 'Réflexions récentes', quiet: 'Réflexion calme', next: 'Prochaine étape douce : faites une petite action et accordez-vous le repos.' },
    de: { header: 'Persönlicher Wellness-Bericht', generated: 'Erstellt', checkins: 'Check-ins', tasks: 'Erledigte Aufgaben', friends: 'Freunde', moodSummary: 'Stimmungsübersicht', recent: 'Letzte Reflexionen', quiet: 'Ruhige Reflexion', next: 'Sanfter nächster Schritt: Tu eine kleine Sache und erlaube dir, dich auszuruhen.' },
    ts: { header: 'Xiviko xa vutshunguri bya wena', generated: 'Xi tumbuluxiwile', checkins: 'Ku kambela', tasks: 'Mintirho leyi hetisiweke', friends: 'Vanghana', moodSummary: 'Nkatsakanyo wa matitwelo', recent: 'Miehleketo ya sweswi', quiet: 'Miehleketo yo rhula', next: 'Goza leri olovaka: endla xilo xin’we lexitsongo u ti pfumelela ku wisa.' },
    mkh: { header: 'Lipoti la thanzi lanu', generated: 'Zapangidwa', checkins: 'Kuyang’ana', tasks: 'Ntchito zomalizidwa', friends: 'Anzanu', moodSummary: 'Chidule cha maganizo', recent: 'Zolingalira zaposachedwa', quiet: 'Kulingalira modekha', next: 'Gawo lofatsa lotsatira: chitani kanthu kakang’ono ndipo lolani kupumula.' },
    sn: { header: 'Report yehutano hwako', generated: 'Yakagadzirwa', checkins: 'Check-ins', tasks: 'Mabasa apera', friends: 'Shamwari', moodSummary: 'Pfupiso yemanzwiro', recent: 'Mafungiro achangobva kuitika', quiet: 'Kufungisisa kwakadzikama', next: 'Nhanho inotevera nyoro: ita chinhu chidiki uye zvibvumire kuzorora.' }
  };

  const supplementalTranslations = {
    es: {
      'overview.pauseLabel': 'La pausa de hoy', 'overview.rhythm': 'Tu ritmo', 'overview.thisWeek': 'Esta semana', 'overview.makeRoom': 'Haz espacio para ti', 'overview.needNow': '¿Qué necesitas ahora?', 'overview.checkInTitle': 'Regístrate', 'overview.checkInText': 'Nombra lo que hay aquí, sin juzgar.', 'overview.checkInAction': 'Abrir diario →', 'overview.calmTitle': 'Encuentra calma', 'overview.calmText': 'Ralentiza la respiración y vuelve.', 'overview.calmAction': 'Probar ejercicio →', 'overview.focusTitle': 'Enfócate con suavidad', 'overview.focusText': 'Crea un poco de impulso, a tu manera.', 'overview.focusAction': 'Abrir estudio →', 'overview.smallThingTitle': 'Una cosa pequeña', 'overview.smallThingText': 'Elige una tarea que parezca posible.', 'overview.smallThingAction': 'Añadir tarea →', 'overview.noticeTitle': 'Un momento para notar', 'overview.noticeText': 'No hay una forma perfecta de usar este espacio.', 'overview.taskLabel': 'Un pequeño paso', 'overview.taskTitle': 'Una lista más tranquila', 'overview.taskAdd': 'Añadir', 'overview.reportTitle': 'Tu informe personal', 'overview.reportText': 'Descarga un resumen privado de tus registros guardados.', 'overview.reportButton': 'Descargar PDF'
    },
    fr: {
      'overview.pauseLabel': 'La pause du jour', 'overview.rhythm': 'Votre rythme', 'overview.thisWeek': 'Cette semaine', 'overview.makeRoom': 'Faites de la place pour vous', 'overview.needNow': 'De quoi avez-vous besoin ?', 'overview.checkInTitle': 'Faire le point', 'overview.checkInText': 'Nommez ce qui est là, sans jugement.', 'overview.checkInAction': 'Ouvrir le journal →', 'overview.calmTitle': 'Retrouver le calme', 'overview.calmText': 'Ralentissez votre respiration et revenez.', 'overview.calmAction': 'Essayer un exercice →', 'overview.focusTitle': 'Se concentrer doucement', 'overview.focusText': 'Créez un peu d’élan, à votre manière.', 'overview.focusAction': 'Ouvrir le studio →', 'overview.smallThingTitle': 'Une petite chose', 'overview.smallThingText': 'Choisissez une tâche faisable.', 'overview.smallThingAction': 'Ajouter une tâche →', 'overview.noticeTitle': 'Un moment pour remarquer', 'overview.noticeText': 'Il n’existe pas de manière parfaite d’utiliser cet espace.', 'overview.taskLabel': 'Une petite étape', 'overview.taskTitle': 'Une liste plus calme', 'overview.taskAdd': 'Ajouter', 'overview.reportTitle': 'Votre rapport personnel', 'overview.reportText': 'Téléchargez un résumé privé de vos check-ins.', 'overview.reportButton': 'Télécharger le PDF'
    },
    de: {
      'overview.pauseLabel': 'Die Pause des Tages', 'overview.rhythm': 'Dein Rhythmus', 'overview.thisWeek': 'Diese Woche', 'overview.makeRoom': 'Schaffe Raum für dich', 'overview.needNow': 'Was brauchst du gerade?', 'overview.checkInTitle': 'Einchecken', 'overview.checkInText': 'Benenne, was gerade da ist, ohne Urteil.', 'overview.checkInAction': 'Tagebuch öffnen →', 'overview.calmTitle': 'Ruhe finden', 'overview.calmText': 'Verlangsame deine Atmung und komm zurück.', 'overview.calmAction': 'Übung ausprobieren →', 'overview.focusTitle': 'Sanft fokussieren', 'overview.focusText': 'Schaffe etwas Schwung auf deine Art.', 'overview.focusAction': 'Studio öffnen →', 'overview.smallThingTitle': 'Eine kleine Sache', 'overview.smallThingText': 'Wähle eine machbare Aufgabe.', 'overview.smallThingAction': 'Aufgabe hinzufügen →', 'overview.noticeTitle': 'Ein Moment zum Wahrnehmen', 'overview.noticeText': 'Es gibt keine perfekte Art, diesen Raum zu nutzen.', 'overview.taskLabel': 'Ein kleiner Schritt', 'overview.taskTitle': 'Eine ruhigere Aufgabenliste', 'overview.taskAdd': 'Hinzufügen', 'overview.reportTitle': 'Dein persönlicher Bericht', 'overview.reportText': 'Lade eine private Zusammenfassung deiner Check-ins herunter.', 'overview.reportButton': 'PDF herunterladen'
    },
    ts: {
      'overview.pauseLabel': 'Ku yima ka namuntlha', 'overview.rhythm': 'Ndzavisiso wa wena', 'overview.thisWeek': 'Vhiki leri', 'overview.makeRoom': 'Endla ndhawu ya wena', 'overview.needNow': 'U lava yini sweswi?', 'overview.checkInTitle': 'Tshama u kambela', 'overview.checkInText': 'Vula leswi nga kona, handle ka ku avanyisa.', 'overview.checkInAction': 'Pfula dayari →', 'overview.calmTitle': 'Kuma ku rhula', 'overview.calmText': 'Nhlisa ku hefemula u tlhela u vuya.', 'overview.calmAction': 'Ringeta ntolovelo →', 'overview.focusTitle': 'Ku kongomisa hi ku olova', 'overview.focusText': 'Tumbuluxa ku ya mahlweni kutsongo.', 'overview.focusAction': 'Pfula studio →', 'overview.smallThingTitle': 'Nchumu wun’we lowutsongo', 'overview.smallThingText': 'Hlawula ku endla loku kotekaka.', 'overview.smallThingAction': 'Engetela ku endla →', 'overview.noticeTitle': 'Nkarhi wa ku xiya', 'overview.noticeText': 'A ku na ndlela leyi hetisekeke yo tirhisa ndhawu leyi.', 'overview.taskLabel': 'Goza rin’we leritsongo', 'overview.taskTitle': 'Nongonoko wo rhula', 'overview.taskAdd': 'Engetela', 'overview.reportTitle': 'Xiviko xa wena', 'overview.reportText': 'Landa nkatsakanyo wa ku kambela ka wena.', 'overview.reportButton': 'Landa PDF'
    },
    mkh: {
      'overview.pauseLabel': 'Kupuma kwa lero', 'overview.rhythm': 'Kuyenda kwanu', 'overview.thisWeek': 'Sabata ino', 'overview.makeRoom': 'Pangani malo anu', 'overview.needNow': 'Mukufuna chiyani tsopano?', 'overview.checkInTitle': 'Yang’anani mkati', 'overview.checkInText': 'Nenani zomwe zilipo popanda kuweruza.', 'overview.checkInAction': 'Tsegulani kalata →', 'overview.calmTitle': 'Pezani mtendere', 'overview.calmText': 'Chepetsani kupuma kwanu mubwerere.', 'overview.calmAction': 'Yesani masewera →', 'overview.focusTitle': 'Yang’anani modekha', 'overview.focusText': 'Pangani kupita patsogolo mwa njira yanu.', 'overview.focusAction': 'Tsegulani studio →', 'overview.smallThingTitle': 'Chinthu chaching’ono', 'overview.smallThingText': 'Sankhani ntchito yomwe ingatheke.', 'overview.smallThingAction': 'Onjezani ntchito →', 'overview.noticeTitle': 'Nthawi yozindikira', 'overview.noticeText': 'Palibe njira yangwiro yogwiritsira ntchito malowa.', 'overview.taskLabel': 'Gawo laling’ono', 'overview.taskTitle': 'Mndandanda wodekha', 'overview.taskAdd': 'Onjezani', 'overview.reportTitle': 'Lipoti lanu', 'overview.reportText': 'Tsitsani chidule cha zomwe mwasunga.', 'overview.reportButton': 'Tsitsani PDF'
    },
    sn: {
      'overview.pauseLabel': 'Kumbomira kwanhasi', 'overview.rhythm': 'Mafambiro ako', 'overview.thisWeek': 'Vhiki rino', 'overview.makeRoom': 'Ita nzvimbo yako', 'overview.needNow': 'Chii chaunoda zvino?', 'overview.checkInTitle': 'Tarisa mukati', 'overview.checkInText': 'Taura zviri pano usingazvitongi.', 'overview.checkInAction': 'Vhura zvinyorwa →', 'overview.calmTitle': 'Tsvaga rugare', 'overview.calmText': 'Deredza kufema kwako wodzoka.', 'overview.calmAction': 'Edza chiitwa →', 'overview.focusTitle': 'Tarisa zvinyoro', 'overview.focusText': 'Gadzira kufambira mberi nenzira yako.', 'overview.focusAction': 'Vhura studio →', 'overview.smallThingTitle': 'Chinhu chidiki', 'overview.smallThingText': 'Sarudza basa rinoita.', 'overview.smallThingAction': 'Wedzera basa →', 'overview.noticeTitle': 'Nguva yekucherechedza', 'overview.noticeText': 'Hapana nzira yakakwana yekushandisa nzvimbo iyi.', 'overview.taskLabel': 'Nhanho diki', 'overview.taskTitle': 'Rondedzero yakadzikama', 'overview.taskAdd': 'Wedzera', 'overview.reportTitle': 'Report yako', 'overview.reportText': 'Dhawunirodha pfupiso yezvawakachengeta.', 'overview.reportButton': 'Dhawunirodha PDF'
    }
  };

  const translations = {
    pt: {
      locale: 'pt-BR',
      title: 'My mindscape',
      text: {
        'brand.tagline': 'o seu espaço mais suave',
        'language.label': 'Idioma',
        'auth.mode': 'Modo da conta',
        'auth.signInOption': 'Entrar',
        'auth.signUpOption': 'Criar conta',
        'auth.firstName': 'Nome',
        'auth.firstNamePlaceholder': 'Nome',
        'auth.lastName': 'Apelido',
        'auth.lastNamePlaceholder': 'Apelido',
        'auth.reason': 'Porque está aqui?',
        'auth.reasonPlaceholder': 'Algumas palavras sobre o apoio de que precisa.',
          'auth.reasonChoose': 'Escolha o que mais ajudaria...',
        'auth.emailPlaceholder': 'voce@exemplo.com',
        'auth.passwordPlaceholder': 'Mínimo de 6 caracteres',
        'overview.pauseLabel': 'Hoje em pausa',
        'overview.affirmationCount': 'Afirmação 1 de 5',
        'overview.rhythm': 'O seu ritmo',
        'overview.thisWeek': 'Esta semana',
        'overview.makeRoom': 'Faça espaço para si',
        'overview.needNow': 'O que precisa agora?',
        'overview.checkInTitle': 'Registar',
        'overview.checkInText': 'Diga o que está aqui, sem julgamento.',
        'overview.checkInAction': 'Abrir diário →',
        'overview.calmTitle': 'Encontrar calma',
        'overview.calmText': 'Abaixe a respiração e volte ao centro.',
        'overview.calmAction': 'Provar exercício →',
        'overview.focusTitle': 'Focar com gentileza',
        'overview.focusText': 'Crie um pouco de movimento, à sua maneira.',
        'overview.focusAction': 'Abrir estúdio →',
        'overview.smallThingTitle': 'Uma coisa pequena',
        'overview.smallThingText': 'Escolha uma tarefa que pareça possível.',
        'overview.smallThingAction': 'Adicionar tarefa →',
        'overview.noticeTitle': 'Um momento para reparar',
        'overview.noticeText': 'Não existe uma forma perfeita de usar este espaço. Siga o que sente como apoiador.',
        'overview.streakTitle': 'Sequência diária de check-ins',
        'overview.streakText': 'Continue a aparecer com gentileza, um dia de cada vez.',
        'overview.streakLabel': 'dias',
        'overview.streakDays': 'dias',
        'overview.taskLabel': 'Um pequeno passo',
        'overview.taskTitle': 'Uma lista mais calma',
        'overview.taskPlaceholder': 'O que parece possível a seguir?',
        'overview.taskAdd': 'Adicionar',
        'overview.taskCount': '{count} restantes',
        'journal.quietCheckin': 'Check-in tranquilo.',
        'task.delete': 'Apagar tarefa',
        'report.unavailable': 'A biblioteca PDF não está disponível neste navegador.',
        'report.quietReflection': 'Reflexão tranquila',
        'report.nextStep': 'Próximo passo gentil: faça uma pequena ação e permita-se descansar.',
        'breath.seconds': 'segundos',
        'breath.second': 'segundo',
        'overview.reportTitle': 'O seu relatório pessoal',
        'overview.reportText': 'Descarregue um resumo privado do seu bem-estar a partir dos seus check-ins guardados.',
        'overview.reportButton': 'Descarregar PDF',
        'friends.circleLabel': 'O seu círculo',
        'friends.title': 'Amigos',
        'friends.namePlaceholder': 'Nome do amigo',
        'friends.contactPlaceholder': 'Detalhe de contacto',
        'friends.addPhoto': 'Adicionar foto',
        'friends.addFriend': 'Adicionar amigo',
        'friends.removeSelected': 'Remover selecionado',
        'friends.whatsapp': 'WhatsApp',
        'friends.instagram': 'Instagram',
        'friends.phone': 'Telefone',
        'mood.eyebrow': 'Clima emocional',
        'mood.title': 'Como se sente por dentro?',
        'mood.subtitle': 'Um check-in é informação, não um julgamento.',
        'mood.chooseFit': 'Escolha o que melhor descreve a sensação',
        'mood.label': 'Dê algumas palavras a isso (opcional)',
        'mood.optional': '(opcional)',
        'mood.placeholder': 'O que está a ocupar o seu pensamento?',
        'mood.promptsLabel': 'Sugestões guiadas...',
        'mood.prompt1': 'Que 3 coisas sente gratidão agora?',
        'mood.prompt2': 'O que tornaria a próxima hora 1% mais fácil?',
        'mood.prompt3': 'O que precisa de ouvir hoje?',
        'focus.whiteNoise': 'Ruído branco',
        'focus.gentleRain': 'Chuva suave',
        'focus.cafe': 'Ambiente de café',
        'focus.listLabel': 'A sua lista',
        'focus.listTitle': 'Pequenos passos contam',
        'focus.listPlaceholder': 'Adicione um próximo passo possível...',
        'focus.addTask': 'Adicionar tarefa',
        'focus.listEmpty': 'A sua lista está limpa. O que seria bom terminar?',
        'mood.save': 'Guardar check-in',
        'mood.recentNotes': 'As suas notas recentes',
        'relief.eyebrow': 'Regularizar e regressar',
        'relief.title': 'Um pouco mais de leveza.',
        'relief.subtitle': 'Escolha uma prática. Pode parar quando precisar.',
        'relief.breathTitle': 'Respiração',
        'relief.breathIntro': 'Respiração em caixa',
        'relief.breathText': 'Quatro lados iguais. Um ritmo tranquilizante.',
        'relief.ready': 'Pronto',
        'relief.start': 'Começar a respirar',
        'relief.pause': 'Pausar',
        'relief.senses': 'Sensações',
        'relief.senseTitle': 'Aterragem 5-4-3-2-1',
        'relief.senseText': 'Use os sentidos para voltar ao momento presente.',
        'relief.progressLabel': '{done} de 5 concluídos',
        'relief.reset': 'Recomeçar',
        'focus.eyebrow': 'Companheiro de estudo e foco',
        'focus.title': 'Faça o foco parecer mais gentil.',
        'focus.subtitle': 'Um próximo passo claro, uma janela limitada, um pouso suave.',
        'focus.pomodoro': 'Pomodoro',
        'focus.work': 'Trabalho',
        'focus.shortBreak': 'Pausa curta',
        'focus.longBreak': 'Pausa longa',
        'focus.deepFocus': 'Foco profundo',
        'focus.shortReset': 'Recomeço curto',
        'focus.longReset': 'Recomeço longo',
        'focus.ready': 'Pronto quando você estiver',
        'focus.startTimer': 'Iniciar temporizador',
        'focus.reset': 'Reiniciar',
        'focus.soundscape': 'Paisagem sonora',
        'focus.soundLabel': 'Preparar o ambiente',
        'focus.volume': 'Volume',
        'focus.live': 'Ao vivo',
        'focus.notes': 'Notas',
        'focus.quickPlan': 'Plano rápido',
        'focus.clear': 'Limpar',
        'focus.planPlaceholder': 'Uma coisa que posso fazer a seguir...',
        'focus.windowComplete': 'Janela concluída',
        'focus.resume': 'Retomar temporizador',
        'focus.pauseTimer': 'Pausar temporizador',
        'focus.focusWindow': 'Está dentro da sua janela de foco',
        'focus.resetMoment': 'Um momento para recuperar',
        'grounding.progress': '{done} de 5 concluídos',
        'grounding.complete': 'Voltou ao presente.',
        'breath.instructions.inhale': 'Inspire',
        'breath.instructions.hold': 'Segure',
        'breath.instructions.exhale': 'Expire',
        'breath.round': 'Ciclo {n}',
        'breath.paused': 'Em pausa',
        'breath.ready': 'Quando estiver pronto',
        'breath.follow': 'Siga o círculo ao seu próprio ritmo.',
        'nav.overview': 'Visão geral',
        'nav.mood': 'Humor e diário',
        'nav.relief': 'Encontrar calma',
        'nav.focus': 'Estúdio de foco',
        'sidebar.noteLabel': 'Um lembrete gentil',
        'sidebar.note': 'Não precisa fazer tudo hoje.',
        'mobile.home': 'Início',
        'mobile.journal': 'Diário',
        'mobile.calm': 'Calma',
        'mobile.focus': 'Foco',
        'auth.login': 'Entrar',
        'auth.clear': 'Limpar dados',
        'auth.eyebrow': 'Espaço privado',
        'auth.loginTitle': 'Entrar no My mindscape',
        'auth.subtitle': 'Guarde o seu progresso com segurança.',
        'auth.signInRequired': 'Inicie sessão para usar esta funcionalidade.',
        'auth.email': 'E-mail',
        'auth.password': 'Palavra-passe',
        'auth.submit': 'Entrar',
        'auth.create': 'Criar uma conta',
        'auth.supabaseTitle': 'Login local',
        'auth.supabaseNote': 'A sua sessão fica guardada neste navegador.',
        'auth.signout': 'Sair',
        'auth.accountCreated': 'Conta criada com sucesso.',
        'auth.checkEmail': 'Conta criada. Verifique o seu e-mail para confirmar a conta antes de entrar.',
        'auth.welcomeBack': 'Bem-vindo de volta.',
        'auth.completeForm': 'Preencha o formulário da conta.',
        'auth.enterDetails': 'Introduza os seus dados.',
        'auth.logoutTitle': 'Terminar sessão',
        'auth.logoutDescription': 'Escolha o que pretende fazer com os dados guardados neste navegador.',
        'auth.logoutOnly': 'Sair e manter os dados',
        'auth.logoutAndClear': 'Sair e limpar todos os dados',
        'auth.cancel': 'Cancelar',
        'auth.signedOut': 'Sessão terminada.',
        'auth.dataCleared': 'Sessão terminada e dados locais apagados.',
        'auth.signupTitle': 'Criar uma conta no My mindscape',
        'auth.signupSubmit': 'Criar conta',
        'auth.switchToLogin': 'Já tenho uma conta',
        'task.empty': 'A sua lista está limpa. O que seria bom terminar?',
        'quick.empty': 'O próximo passo pode ser pequeno.',
        'journal.empty': 'As suas reflexões privadas aparecerão aqui.',
        'journal.entry': 'entrada',
        'journal.entries': 'entradas',
        'report.title': 'O seu relatório pessoal',
        'report.note': 'Descarregue um resumo privado do seu bem-estar a partir dos seus check-ins guardados.',
        'report.button': 'Descarregar PDF',
        'share.quote': 'Partilhar citação',
        'friends.title': 'Amigos',
        'friends.empty': 'Ainda não adicionou amigos.',
        'friendName': 'Nome do amigo',
        'friendContact': 'Detalhe de contacto',
        'friendAddPhoto': 'Adicionar foto',
        'friendAdd': 'Adicionar amigo',
        'friendRemove': 'Remover amigos',
        'friendSave': 'Guardar perfil do amigo',
        'friendEdit': 'Editar amigo',
        'friendContactLabel': 'Detalhe de contacto',
        'friendAddPrompt': 'Adicione um nome e um contacto primeiro.',
        'report.downloaded': 'Relatório guardado em PDF.',
        'journal.saved': 'Check-in guardado em privado.',
        'task.saved': 'Uma pequena etapa foi adicionada.',
        'task.complete': 'Tarefa concluída.',
        'auth.error.invalid': 'E-mail ou palavra-passe inválidos.',
        'auth.error.exist': 'Este e-mail já existe. Tente entrar.',
        'auth.error.general': 'Não foi possível concluir esta ação.',
        'signIn': 'Entrar',
        'signOut': 'Sair',
        'page.overview': 'Bom dia, amigo.',
        'page.mood': 'Um momento de honestidade.',
        'page.relief': 'Volte ao seu corpo.',
        'page.focus': 'Torne o foco mais gentil.',
        'streak.title': 'Sequência diária de check-ins',
        'streak.subtitle': 'Continue a aparecer com gentileza, um dia de cada vez.',
        'streak.label': 'dias',
        'prompt.placeholder': 'O que parece possível a seguir?',
        'prompt.add': 'Adicionar',
        'friend.select': 'Selecione um amigo',
        'friend.chat': 'Conversa privada',
        'friend.circle': 'O seu círculo',
        'friend.noMessage': 'Ainda não há mensagens. Diga olá.',
        'friend.emptyChat': 'Adicione um amigo para começar a conversar.'
      },
      moods: ['Radiante', 'Calmo', 'Ansioso', 'Em baixo', 'Sobrecarregado'],
      grounding: [
        { sense: 'ver', prompt: 'Nomeie cinco coisas que consegue ver.' },
        { sense: 'tocar', prompt: 'Note quatro coisas que consegue tocar.' },
        { sense: 'ouvir', prompt: 'Escute três coisas que consegue ouvir.' },
        { sense: 'cheirar', prompt: 'Encontre dois cheiros à sua volta.' },
        { sense: 'saborear', prompt: 'Note uma coisa que consegue saborear.' }
      ],
      affirmations: [
        'Pode recomeçar com gentileza.',
        'Pequenos passos também são movimento.',
        'Pode encontrar este momento, uma respiração de cada vez.',
        'O descanso faz parte do caminho.',
        'A sua atenção é preciosa.'
        , 'Saia disso.'
      ],
      affirmationPrefix: 'Afirmação',
      affirmationConnector: 'de',
      pageTitle: 'My mindscape'
    },
    en: {
      locale: 'en-US',
      title: 'My mindscape',
      text: {
        'brand.tagline': 'your softer space',
        'language.label': 'Language',
        'auth.mode': 'Account mode',
        'auth.signInOption': 'Sign in',
        'auth.signUpOption': 'Create account',
        'auth.firstName': 'First name',
        'auth.firstNamePlaceholder': 'First name',
        'auth.lastName': 'Last name',
        'auth.lastNamePlaceholder': 'Last name',
        'auth.reason': 'Why are you here?',
        'auth.reasonPlaceholder': 'A few words about what you need support with.',
          'auth.reasonChoose': 'Choose what would help most...',
        'auth.emailPlaceholder': 'you@example.com',
        'auth.passwordPlaceholder': 'Minimum 6 characters',
        'overview.pauseLabel': "Today's pause",
        'overview.affirmationCount': 'Affirmation 1 of 5',
        'overview.rhythm': 'Your rhythm',
        'overview.thisWeek': 'This week',
        'overview.makeRoom': 'Make room for yourself',
        'overview.needNow': 'What do you need right now?',
        'overview.checkInTitle': 'Check in',
        'overview.checkInText': 'Name what is here, without judgment.',
        'overview.checkInAction': 'Open journal →',
        'overview.calmTitle': 'Find calm',
        'overview.calmText': 'Slow your breathing and come back.',
        'overview.calmAction': 'Try an exercise →',
        'overview.focusTitle': 'Focus gently',
        'overview.focusText': 'Create a little momentum, your way.',
        'overview.focusAction': 'Open studio →',
        'overview.smallThingTitle': 'One small thing',
        'overview.smallThingText': 'Choose a task that feels doable.',
        'overview.smallThingAction': 'Add a task →',
        'overview.noticeTitle': 'A moment to notice',
        'overview.noticeText': 'There is no perfect way to use this space. Follow what feels supportive.',
        'overview.streakTitle': 'Daily check-in streak',
        'overview.streakText': 'Keep showing up gently, one day at a time.',
        'overview.streakLabel': 'days',
        'overview.streakDays': 'days',
        'overview.taskLabel': 'One small step',
        'overview.taskTitle': 'A calmer to-do list',
        'overview.taskPlaceholder': 'What feels doable next?',
        'overview.taskAdd': 'Add',
        'overview.taskCount': '{count} left',
        'journal.quietCheckin': 'Quiet check-in.',
        'task.delete': 'Delete task',
        'report.unavailable': 'PDF library is unavailable in this browser.',
        'report.quietReflection': 'Quiet reflection',
        'report.nextStep': 'Gentle next step: take one small action and give yourself permission to rest.',
        'breath.seconds': 'seconds',
        'breath.second': 'second',
        'overview.reportTitle': 'Your personal report',
        'overview.reportText': 'Download a private wellness summary from your saved check-ins.',
        'overview.reportButton': 'Download PDF',
        'friends.circleLabel': 'Your circle',
        'friends.namePlaceholder': "Friend's name",
        'friends.contactPlaceholder': 'Contact detail',
        'friends.addPhoto': 'Add photo',
        'friends.addFriend': 'Add friend',
        'friends.removeSelected': 'Remove selected',
        'friends.whatsapp': 'WhatsApp',
        'friends.instagram': 'Instagram',
        'friends.phone': 'Phone',
        'mood.eyebrow': 'Emotional weather',
        'mood.title': 'How is it feeling inside?',
        'mood.subtitle': 'A check-in is information, not a verdict.',
        'mood.chooseFit': 'Choose the closest fit',
        'mood.label': 'Put a few words to it (optional)',
        'mood.optional': '(optional)',
        'mood.placeholder': 'What is taking up space in your mind?',
        'mood.promptsLabel': 'Guided prompts...',
        'mood.prompt1': 'What are 3 things you are grateful for right now?',
        'mood.prompt2': 'What would make the next hour 1% easier?',
        'mood.prompt3': 'What do you need to hear today?',
        'focus.whiteNoise': 'White noise',
        'focus.gentleRain': 'Gentle rain',
        'focus.cafe': 'Cafe ambience',
        'focus.listLabel': 'Your list',
        'focus.listTitle': 'Small steps count',
        'focus.listPlaceholder': 'Add a doable next step...',
        'focus.addTask': 'Add task',
        'focus.listEmpty': 'Your list is clear. What would feel good to finish?',
        'mood.save': 'Save check-in',
        'mood.recentNotes': 'Your recent notes',
        'relief.eyebrow': 'Regulate & return',
        'relief.title': 'A little more ease.',
        'relief.subtitle': 'Choose one practice. You can stop whenever you need.',
        'relief.breathTitle': '01 / Breath',
        'relief.breathIntro': 'Box breathing',
        'relief.breathText': 'Four equal sides. A steadying rhythm.',
        'relief.ready': 'Ready',
        'relief.start': 'Start breathing',
        'relief.pause': 'Pause',
        'relief.senses': '02 / Senses',
        'relief.senseTitle': '5-4-3-2-1 grounding',
        'relief.senseText': 'Use your senses to anchor in the present moment.',
        'relief.progressLabel': '{done} of 5 complete',
        'relief.reset': 'Reset',
        'focus.eyebrow': 'Study & focus companion',
        'focus.title': 'Make focus feel kinder.',
        'focus.subtitle': 'A clear next step, a contained window, a soft landing.',
        'focus.pomodoro': 'Pomodoro',
        'focus.work': 'Work',
        'focus.shortBreak': 'Short break',
        'focus.longBreak': 'Long break',
        'focus.deepFocus': 'Deep focus',
        'focus.shortReset': 'Short reset',
        'focus.longReset': 'Long reset',
        'focus.ready': 'Ready when you are',
        'focus.startTimer': 'Start timer',
        'focus.reset': 'Reset',
        'focus.soundscape': 'Soundscape',
        'focus.soundLabel': 'Set the room',
        'focus.volume': 'Volume',
        'focus.live': 'Live',
        'focus.notes': 'Notes',
        'focus.quickPlan': 'Quick plan',
        'focus.clear': 'Clear',
        'focus.planPlaceholder': 'One thing I can do next...',
        'focus.windowComplete': 'Window complete',
        'focus.resume': 'Resume timer',
        'focus.pauseTimer': 'Pause timer',
        'focus.focusWindow': 'You are in your focus window',
        'focus.resetMoment': 'A moment to reset',
        'grounding.progress': '{done} of 5 complete',
        'grounding.complete': 'You made it back to the present.',
        'breath.instructions.inhale': 'Breathe in',
        'breath.instructions.hold': 'Hold',
        'breath.instructions.exhale': 'Breathe out',
        'breath.round': 'Round {n}',
        'breath.paused': 'Paused',
        'breath.ready': 'Ready?',
        'breath.follow': 'Follow the circle at your own pace.',
        'nav.overview': 'Overview',
        'nav.mood': 'Mood & journal',
        'nav.relief': 'Find calm',
        'nav.focus': 'Focus studio',
        'sidebar.noteLabel': 'A gentle note',
        'sidebar.note': "You don't have to do everything today.",
        'mobile.home': 'Home',
        'mobile.journal': 'Journal',
        'mobile.calm': 'Calm',
        'mobile.focus': 'Focus',
        'auth.login': 'Sign in',
        'auth.clear': 'Clear data',
        'auth.eyebrow': 'Private space',
        'auth.loginTitle': 'Sign in to My mindscape',
        'auth.subtitle': 'Keep your progress safe.',
        'auth.signInRequired': 'Sign in to use this feature.',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.submit': 'Sign in',
        'auth.create': 'Create an account',
        'auth.supabaseTitle': 'Local login',
        'auth.supabaseNote': 'Your session is saved in this browser.',
        'auth.signout': 'Sign out',
        'auth.completeForm': 'Please complete the account form.',
        'auth.enterDetails': 'Please enter your details.',
        'auth.logoutTitle': 'Sign out',
        'auth.logoutDescription': 'Choose what to do with the data saved in this browser.',
        'auth.logoutOnly': 'Sign out and keep data',
        'auth.logoutAndClear': 'Sign out and clear all data',
        'auth.cancel': 'Cancel',
        'auth.signedOut': 'You have been signed out.',
        'auth.dataCleared': 'Signed out and local data cleared.',
        'auth.signupTitle': 'Create a My mindscape account',
        'auth.signupSubmit': 'Create account',
        'auth.switchToLogin': 'I already have an account',
        'auth.accountCreated': 'Account created successfully.',
        'auth.checkEmail': 'Account created. Check your email to confirm your account before signing in.',
        'auth.welcomeBack': 'Welcome back.',
        'task.empty': 'Your list is clear. What would feel good to finish?',
        'quick.empty': 'Your next step can be small.',
        'journal.empty': 'Your private reflections will appear here.',
        'journal.entry': 'entry',
        'journal.entries': 'entries',
        'report.title': 'Your personal report',
        'report.note': 'Download a private wellness summary from your saved check-ins.',
        'report.button': 'Download PDF',
        'share.quote': 'Share quote',
        'friends.title': 'Friends',
        'friends.empty': 'No friends added yet.',
        'friendName': "Friend's name",
        'friendContact': 'Contact detail',
        'friendAddPhoto': 'Add photo',
        'friendAdd': 'Add friend',
        'friendRemove': 'Remove friends',
        'friendSave': 'Save friend profile',
        'friendEdit': 'Edit selected friend',
        'friendContactLabel': 'Contact detail',
        'friendAddPrompt': 'Add a name and contact detail first.',
        'report.downloaded': 'PDF report saved.',
        'journal.saved': 'Your check-in is saved privately.',
        'task.saved': 'A small step has been added.',
        'task.complete': 'Task completed.',
        'auth.error.invalid': 'Invalid email or password.',
        'auth.error.exist': 'This email already exists. Try signing in.',
        'auth.error.general': 'This action could not be completed.',
        'signIn': 'Sign in',
        'signOut': 'Sign out',
        'page.overview': 'Good morning, friend.',
        'page.mood': 'A moment to be honest.',
        'page.relief': 'Come back to your body.',
        'page.focus': 'Make focus feel kinder.',
        'streak.title': 'Daily check-in streak',
        'streak.subtitle': 'Keep showing up gently, one day at a time.',
        'streak.label': 'days',
        'prompt.placeholder': 'What feels doable next?',
        'prompt.add': 'Add',
        'friend.select': 'Select a friend',
        'friend.chat': 'Private conversation',
        'friend.circle': 'Your circle',
        'friend.noMessage': 'No messages yet. Say hello.',
        'friend.emptyChat': 'Add a friend to start chatting.'
      },
      moods: ['Radiant', 'Calm', 'Anxious', 'Down', 'Overwhelmed'],
      grounding: [
        { sense: 'see', prompt: 'Name five things you can see.' },
        { sense: 'touch', prompt: 'Notice four things you can touch.' },
        { sense: 'hear', prompt: 'Listen for three things you can hear.' },
        { sense: 'smell', prompt: 'Find two things you can smell.' },
        { sense: 'taste', prompt: 'Notice one thing you can taste.' }
      ],
      affirmations: [
        'You are allowed to begin again, gently.',
        'Small steps are still movement.',
        'You can meet this moment one breath at a time.',
        'Rest is part of the work, not a reward for finishing.',
        'Your attention is precious. Spend it with care.'
        , 'Get out of it.'
      ],
      affirmationPrefix: 'Affirmation',
      affirmationConnector: 'of',
      pageTitle: 'My mindscape'
    },
    es: {
      locale: 'es-ES',
      title: 'My mindscape',
      text: {
        'overview.streakDays': 'días',
        'nav.overview': 'Resumen',
        'nav.mood': 'Ánimo y diario',
        'nav.relief': 'Encontrar calma',
        'nav.focus': 'Estudio y foco',
        'sidebar.noteLabel': 'Un recordatorio amable',
        'sidebar.note': 'No tienes que hacerlo todo hoy.',
        'mobile.home': 'Inicio',
        'mobile.journal': 'Diario',
        'mobile.calm': 'Calma',
        'mobile.focus': 'Foco',
        'auth.login': 'Entrar',
        'auth.clear': 'Borrar datos',
        'auth.eyebrow': 'Espacio privado',
        'auth.loginTitle': 'Entrar en My mindscape',
        'auth.subtitle': 'Guarda tu progreso de forma segura.',
        'auth.email': 'Correo electrónico',
        'auth.password': 'Contraseña',
        'auth.submit': 'Entrar',
        'auth.create': 'Crear una cuenta',
        'auth.supabaseTitle': 'Inicio local',
        'auth.supabaseNote': 'Tu sesión se guarda en este navegador.',
        'auth.signout': 'Salir',
        'auth.completeForm': 'Completa el formulario de la cuenta.',
        'auth.enterDetails': 'Introduce tus datos.',
        'auth.accountCreated': 'Cuenta creada correctamente.',
        'auth.checkEmail': 'Cuenta creada. Revisa tu correo electrónico para confirmar la cuenta antes de iniciar sesión.',
        'auth.welcomeBack': 'Bienvenido de nuevo.',
        'task.empty': 'Tu lista está limpia. ¿Qué te gustaría terminar?',
        'quick.empty': 'Tu próximo paso puede ser pequeño.',
        'journal.empty': 'Tus reflexiones privadas aparecerán aquí.',
        'journal.entry': 'entrada',
        'journal.entries': 'entradas',
        'report.title': 'Tu informe personal',
        'report.note': 'Descarga un resumen privado de tu bienestar a partir de tus registros guardados.',
        'report.button': 'Descargar PDF',
        'friends.title': 'Amigos',
        'friends.empty': 'Aún no has añadido amigos.',
        'friendName': 'Nombre del amigo',
        'friendContact': 'Detalle de contacto',
        'friendAddPhoto': 'Añadir foto',
        'friendAdd': 'Añadir amigo',
        'friendRemove': 'Eliminar amigos',
        'friendSave': 'Guardar perfil del amigo',
        'friendEdit': 'Editar amigo',
        'friendContactLabel': 'Detalle de contacto',
        'friendAddPrompt': 'Primero añade un nombre y un contacto.',
        'report.downloaded': 'Informe PDF guardado.',
        'journal.saved': 'Tu check-in se ha guardado en privado.',
        'task.saved': 'Se ha añadido un paso pequeño.',
        'task.complete': 'Tarea completada.',
        'auth.error.invalid': 'Correo o contraseña no válidos.',
        'auth.error.exist': 'Este correo ya existe. Intenta iniciar sesión.',
        'auth.error.general': 'No se pudo completar esta acción.',
        'signIn': 'Entrar',
        'signOut': 'Salir',
        'page.overview': 'Buenos días, amigo.',
        'page.mood': 'Un momento de honestidad.',
        'page.relief': 'Vuelve a tu cuerpo.',
        'page.focus': 'Haz que el foco sea más amable.',
        'streak.title': 'Racha diaria de registros',
        'streak.subtitle': 'Sigue apareciendo con gentileza, un día a la vez.',
        'streak.label': 'días',
        'prompt.placeholder': '¿Qué parece posible ahora?',
        'prompt.add': 'Añadir',
        'friend.select': 'Selecciona un amigo',
        'friend.chat': 'Conversación privada',
        'friend.circle': 'Tu círculo',
        'friend.noMessage': 'Aún no hay mensajes. Di hola.',
        'friend.emptyChat': 'Añade un amigo para empezar a chatear.'
      ,
        'auth.cancel': 'Cancelar',
        'auth.dataCleared': 'Sesión cerrada y datos locales borrados.',
        'auth.emailPlaceholder': 'tu@ejemplo.com',
        'auth.firstName': 'Nombre',
        'auth.firstNamePlaceholder': 'Nombre',
        'auth.lastName': 'Apellido',
        'auth.lastNamePlaceholder': 'Apellido',
        'auth.logoutAndClear': 'Salir y borrar todos los datos',
        'auth.logoutDescription': 'Elige qué hacer con los datos guardados en este navegador.',
        'auth.logoutOnly': 'Salir y conservar los datos',
        'auth.logoutTitle': 'Cerrar sesión',
        'auth.mode': 'Modo de cuenta',
        'auth.passwordPlaceholder': 'Mínimo 6 caracteres',
        'auth.reason': '¿Por qué estás aquí?',
        'auth.reasonChoose': 'Elige lo que más te ayudaría...',
        'auth.reasonPlaceholder': 'Unas palabras sobre el apoyo que necesitas.',
        'auth.signInOption': 'Iniciar sesión',
        'auth.signInRequired': 'Inicia sesión para usar esta función.',
        'auth.signUpOption': 'Crear cuenta',
        'auth.signedOut': 'Has cerrado sesión.',
        'auth.signupSubmit': 'Crear cuenta',
        'auth.signupTitle': 'Crear una cuenta en My mindscape',
        'auth.switchToLogin': 'Ya tengo una cuenta',
        'brand.tagline': 'tu espacio más suave',
        'breath.follow': 'Sigue el círculo a tu propio ritmo.',
        'breath.instructions.exhale': 'Exhala',
        'breath.instructions.hold': 'Mantén',
        'breath.instructions.inhale': 'Inhala',
        'breath.paused': 'En pausa',
        'breath.ready': '¿Listo?',
        'breath.round': 'Ronda {n}',
        'breath.second': 'segundo',
        'breath.seconds': 'segundos',
        'focus.addTask': 'Añadir tarea',
        'focus.cafe': 'Ambiente de café',
        'focus.clear': 'Limpiar',
        'focus.deepFocus': 'Concentración profunda',
        'focus.eyebrow': 'Compañero de estudio y foco',
        'focus.focusWindow': 'Estás en tu ventana de foco',
        'focus.gentleRain': 'Lluvia suave',
        'focus.listEmpty': 'Tu lista está limpia. ¿Qué te gustaría terminar?',
        'focus.listLabel': 'Tu lista',
        'focus.listPlaceholder': 'Añade un próximo paso posible...',
        'focus.listTitle': 'Los pequeños pasos cuentan',
        'focus.live': 'En directo',
        'focus.longBreak': 'Descanso largo',
        'focus.longReset': 'Reinicio largo',
        'focus.notes': 'Notas',
        'focus.pauseTimer': 'Pausar temporizador',
        'focus.planPlaceholder': 'Una cosa que puedo hacer a continuación...',
        'focus.pomodoro': 'Pomodoro',
        'focus.quickPlan': 'Plan rápido',
        'focus.ready': 'Listo cuando tú lo estés',
        'focus.reset': 'Reiniciar',
        'focus.resetMoment': 'Un momento para reiniciar',
        'focus.resume': 'Reanudar temporizador',
        'focus.shortBreak': 'Descanso corto',
        'focus.shortReset': 'Reinicio corto',
        'focus.soundLabel': 'Prepara el ambiente',
        'focus.soundscape': 'Paisaje sonoro',
        'focus.startTimer': 'Iniciar temporizador',
        'focus.subtitle': 'Un próximo paso claro, una ventana contenida, un aterrizaje suave.',
        'focus.title': 'Haz que enfocarte se sienta más amable.',
        'focus.volume': 'Volumen',
        'focus.whiteNoise': 'Ruido blanco',
        'focus.windowComplete': 'Ventana completada',
        'focus.work': 'Trabajo',
        'friends.instagram': 'Instagram',
        'friends.phone': 'Teléfono',
        'friends.whatsapp': 'WhatsApp',
        'grounding.complete': 'Has vuelto al presente.',
        'grounding.progress': '{done} de 5 completados',
        'journal.quietCheckin': 'Registro tranquilo.',
        'language.label': 'Idioma',
        'mood.chooseFit': 'Elige lo que más se ajuste',
        'mood.eyebrow': 'Clima emocional',
        'mood.label': 'Ponle unas palabras (opcional)',
        'mood.optional': '(opcional)',
        'mood.placeholder': '¿Qué está ocupando espacio en tu mente?',
        'mood.prompt1': '¿Qué 3 cosas agradeces ahora mismo?',
        'mood.prompt2': '¿Qué haría que la próxima hora fuera 1% más fácil?',
        'mood.prompt3': '¿Qué necesitas escuchar hoy?',
        'mood.promptsLabel': 'Sugerencias guiadas...',
        'mood.recentNotes': 'Tus notas recientes',
        'mood.save': 'Guardar registro',
        'mood.subtitle': 'Un registro es información, no un veredicto.',
        'mood.title': '¿Cómo te sientes por dentro?',
        'overview.affirmationCount': 'Afirmación 1 de 5',
        'overview.taskCount': '{count} restantes',
        'relief.breathIntro': 'Respiración en caja',
        'relief.breathText': 'Cuatro lados iguales. Un ritmo que estabiliza.',
        'relief.breathTitle': '01 / Respiración',
        'relief.eyebrow': 'Regular y regresar',
        'relief.pause': 'Pausar',
        'relief.progressLabel': '{done} de 5 completados',
        'relief.ready': 'Listo',
        'relief.reset': 'Reiniciar',
        'relief.senseText': 'Usa tus sentidos para anclarte en el momento presente.',
        'relief.senseTitle': 'Anclaje 5-4-3-2-1',
        'relief.senses': '02 / Sentidos',
        'relief.start': 'Empezar a respirar',
        'relief.subtitle': 'Elige una práctica. Puedes parar cuando lo necesites.',
        'relief.title': 'Un poco más de calma.',
        'report.nextStep': 'Próximo paso amable: haz una pequeña acción y date permiso para descansar.',
        'report.quietReflection': 'Reflexión tranquila',
        'report.unavailable': 'La biblioteca de PDF no está disponible en este navegador.',
        'share.quote': 'Compartir cita',
        'task.delete': 'Eliminar tarea',
      },
      moods: ['Radiante', 'Calmado', 'Ansioso', 'Bajo', 'Abrumado'],
      grounding: [
        { sense: 'ver', prompt: 'Nombra cinco cosas que puedas ver.' },
        { sense: 'tocar', prompt: 'Nota cuatro cosas que puedas tocar.' },
        { sense: 'oir', prompt: 'Escucha tres cosas que puedas oír.' },
        { sense: 'oler', prompt: 'Encuentra dos cosas que puedas oler.' },
        { sense: 'gustar', prompt: 'Nota una cosa que puedas saborear.' }
      ],
      affirmations: [
        'Puedes empezar de nuevo con suavidad.',
        'Los pequeños pasos también son movimiento.',
        'Puedes enfrentarte a este momento un respiro a la vez.',
        'El descanso forma parte del trabajo.',
        'Tu atención es valiosa. Cuídala.'
        , 'Sal de ahí.'
      ],
      affirmationPrefix: 'Afirmación',
      affirmationConnector: 'de',
      pageTitle: 'My mindscape'
    },
    fr: {
      locale: 'fr-FR',
      title: 'My mindscape',
      text: {
        'overview.streakDays': 'jours',
        'nav.overview': 'Vue d’ensemble',
        'nav.mood': 'Humeur & journal',
        'nav.relief': 'Trouver le calme',
        'nav.focus': 'Studio de focus',
        'sidebar.noteLabel': 'Petite note',
        'sidebar.note': 'Tu n’as pas besoin de tout faire aujourd’hui.',
        'mobile.home': 'Accueil',
        'mobile.journal': 'Journal',
        'mobile.calm': 'Calme',
        'mobile.focus': 'Focus',
        'auth.login': 'Se connecter',
        'auth.clear': 'Effacer les données',
        'auth.eyebrow': 'Espace privé',
        'auth.loginTitle': 'Connexion à My mindscape',
        'auth.subtitle': 'Gardez votre progression en sécurité.',
        'auth.email': 'E-mail',
        'auth.password': 'Mot de passe',
        'auth.submit': 'Se connecter',
        'auth.create': 'Créer un compte',
        'auth.supabaseTitle': 'Connexion locale',
        'auth.supabaseNote': 'Votre session est enregistrée dans ce navigateur.',
        'auth.signout': 'Se déconnecter',
        'auth.completeForm': 'Veuillez compléter le formulaire du compte.',
        'auth.enterDetails': 'Veuillez renseigner vos informations.',
        'auth.accountCreated': 'Compte créé avec succès.',
        'auth.checkEmail': 'Compte créé. Vérifiez votre e-mail pour confirmer votre compte avant de vous connecter.',
        'auth.welcomeBack': 'Bon retour.',
        'task.empty': 'Votre liste est vide. Qu’est-ce qui semble faisable ?',
        'quick.empty': 'La prochaine étape peut être petite.',
        'journal.empty': 'Vos réflexions privées apparaîtront ici.',
        'journal.entry': 'entrée',
        'journal.entries': 'entrées',
        'report.title': 'Votre rapport personnel',
        'report.note': 'Téléchargez un résumé privé de votre bien-être.',
        'report.button': 'Télécharger le PDF',
        'friends.title': 'Amis',
        'friends.empty': 'Aucun ami ajouté pour le moment.',
        'friendName': 'Nom de l’ami',
        'friendContact': 'Coordonnées',
        'friendAddPhoto': 'Ajouter une photo',
        'friendAdd': 'Ajouter un ami',
        'friendRemove': 'Supprimer les amis',
        'friendSave': 'Enregistrer le profil',
        'friendEdit': 'Modifier l’ami',
        'friendContactLabel': 'Coordonnées',
        'friendAddPrompt': 'Ajoutez d’abord un nom et des coordonnées.',
        'report.downloaded': 'Rapport PDF enregistré.',
        'journal.saved': 'Votre check-in est enregistré en privé.',
        'task.saved': 'Une petite étape a été ajoutée.',
        'task.complete': 'Tâche terminée.',
        'auth.error.invalid': 'E-mail ou mot de passe invalide.',
        'auth.error.exist': 'Ce compte existe déjà. Essayez de vous connecter.',
        'auth.error.general': 'Cette action n’a pas pu être terminée.',
        'signIn': 'Se connecter',
        'signOut': 'Se déconnecter',
        'page.overview': 'Bonjour, ami.',
        'page.mood': 'Un moment d’honnêteté.',
        'page.relief': 'Revenez à votre corps.',
        'page.focus': 'Rendez le focus plus doux.',
        'streak.title': 'Série de check-ins',
        'streak.subtitle': 'Continuez doucement, un jour à la fois.',
        'streak.label': 'jours',
        'prompt.placeholder': 'Qu’est-ce qui semble faisable ensuite ?',
        'prompt.add': 'Ajouter',
        'friend.select': 'Choisir un ami',
        'friend.chat': 'Conversation privée',
        'friend.circle': 'Votre cercle',
        'friend.noMessage': 'Pas encore de messages. Dites bonjour.',
        'friend.emptyChat': 'Ajoutez un ami pour commencer à discuter.'
      ,
        'auth.cancel': 'Annuler',
        'auth.dataCleared': 'Déconnecté et données locales effacées.',
        'auth.emailPlaceholder': 'vous@exemple.com',
        'auth.firstName': 'Prénom',
        'auth.firstNamePlaceholder': 'Prénom',
        'auth.lastName': 'Nom',
        'auth.lastNamePlaceholder': 'Nom',
        'auth.logoutAndClear': 'Se déconnecter et effacer toutes les données',
        'auth.logoutDescription': 'Choisissez ce que vous voulez faire des données enregistrées dans ce navigateur.',
        'auth.logoutOnly': 'Se déconnecter et conserver les données',
        'auth.logoutTitle': 'Déconnexion',
        'auth.mode': 'Mode du compte',
        'auth.passwordPlaceholder': 'Minimum 6 caractères',
        'auth.reason': 'Pourquoi êtes-vous ici ?',
        'auth.reasonChoose': 'Choisissez ce qui vous aiderait le plus...',
        'auth.reasonPlaceholder': 'Quelques mots sur le soutien dont vous avez besoin.',
        'auth.signInOption': 'Se connecter',
        'auth.signInRequired': 'Connectez-vous pour utiliser cette fonctionnalité.',
        'auth.signUpOption': 'Créer un compte',
        'auth.signedOut': 'Vous avez été déconnecté.',
        'auth.signupSubmit': 'Créer un compte',
        'auth.signupTitle': 'Créer un compte My mindscape',
        'auth.switchToLogin': 'J’ai déjà un compte',
        'brand.tagline': 'votre espace plus doux',
        'breath.follow': 'Suivez le cercle à votre propre rythme.',
        'breath.instructions.exhale': 'Expirez',
        'breath.instructions.hold': 'Retenez',
        'breath.instructions.inhale': 'Inspirez',
        'breath.paused': 'En pause',
        'breath.ready': 'Prêt ?',
        'breath.round': 'Cycle {n}',
        'breath.second': 'seconde',
        'breath.seconds': 'secondes',
        'focus.addTask': 'Ajouter une tâche',
        'focus.cafe': 'Ambiance de café',
        'focus.clear': 'Effacer',
        'focus.deepFocus': 'Concentration profonde',
        'focus.eyebrow': 'Compagnon d’étude et de concentration',
        'focus.focusWindow': 'Vous êtes dans votre fenêtre de concentration',
        'focus.gentleRain': 'Pluie douce',
        'focus.listEmpty': 'Votre liste est vide. Qu’aimeriez-vous terminer ?',
        'focus.listLabel': 'Votre liste',
        'focus.listPlaceholder': 'Ajoutez une prochaine étape réalisable...',
        'focus.listTitle': 'Les petits pas comptent',
        'focus.live': 'En direct',
        'focus.longBreak': 'Pause longue',
        'focus.longReset': 'Réinitialisation longue',
        'focus.notes': 'Notes',
        'focus.pauseTimer': 'Mettre le minuteur en pause',
        'focus.planPlaceholder': 'Une chose que je peux faire ensuite...',
        'focus.pomodoro': 'Pomodoro',
        'focus.quickPlan': 'Plan rapide',
        'focus.ready': 'Prêt quand vous l’êtes',
        'focus.reset': 'Réinitialiser',
        'focus.resetMoment': 'Un moment pour se recentrer',
        'focus.resume': 'Reprendre le minuteur',
        'focus.shortBreak': 'Pause courte',
        'focus.shortReset': 'Réinitialisation courte',
        'focus.soundLabel': 'Préparez l’ambiance',
        'focus.soundscape': 'Paysage sonore',
        'focus.startTimer': 'Démarrer le minuteur',
        'focus.subtitle': 'Une prochaine étape claire, une fenêtre limitée, un atterrissage en douceur.',
        'focus.title': 'Rendez la concentration plus douce.',
        'focus.volume': 'Volume',
        'focus.whiteNoise': 'Bruit blanc',
        'focus.windowComplete': 'Fenêtre terminée',
        'focus.work': 'Travail',
        'friends.instagram': 'Instagram',
        'friends.phone': 'Téléphone',
        'friends.whatsapp': 'WhatsApp',
        'grounding.complete': 'Vous êtes de retour dans le présent.',
        'grounding.progress': '{done} sur 5 complétés',
        'journal.quietCheckin': 'Check-in tranquille.',
        'language.label': 'Langue',
        'mood.chooseFit': 'Choisissez ce qui correspond le mieux',
        'mood.eyebrow': 'Météo émotionnelle',
        'mood.label': 'Mettez quelques mots dessus (facultatif)',
        'mood.optional': '(facultatif)',
        'mood.placeholder': 'Qu’est-ce qui occupe votre esprit ?',
        'mood.prompt1': 'Quelles sont 3 choses pour lesquelles vous êtes reconnaissant en ce moment ?',
        'mood.prompt2': 'Qu’est-ce qui rendrait la prochaine heure 1 % plus facile ?',
        'mood.prompt3': 'Qu’avez-vous besoin d’entendre aujourd’hui ?',
        'mood.promptsLabel': 'Suggestions guidées...',
        'mood.recentNotes': 'Vos notes récentes',
        'mood.save': 'Enregistrer le check-in',
        'mood.subtitle': 'Un check-in est une information, pas un verdict.',
        'mood.title': 'Comment vous sentez-vous à l’intérieur ?',
        'overview.affirmationCount': 'Affirmation 1 sur 5',
        'overview.taskCount': '{count} restantes',
        'relief.breathIntro': 'Respiration carrée',
        'relief.breathText': 'Quatre côtés égaux. Un rythme apaisant.',
        'relief.breathTitle': '01 / Respiration',
        'relief.eyebrow': 'Se réguler et revenir',
        'relief.pause': 'Pause',
        'relief.progressLabel': '{done} sur 5 complétés',
        'relief.ready': 'Prêt',
        'relief.reset': 'Réinitialiser',
        'relief.senseText': 'Utilisez vos sens pour vous ancrer dans le moment présent.',
        'relief.senseTitle': 'Ancrage 5-4-3-2-1',
        'relief.senses': '02 / Sens',
        'relief.start': 'Commencer à respirer',
        'relief.subtitle': 'Choisissez une pratique. Vous pouvez arrêter dès que vous en avez besoin.',
        'relief.title': 'Un peu plus de légèreté.',
        'report.nextStep': 'Prochaine étape en douceur : faites une petite action et accordez-vous la permission de vous reposer.',
        'report.quietReflection': 'Réflexion tranquille',
        'report.unavailable': 'La bibliothèque PDF n’est pas disponible dans ce navigateur.',
        'share.quote': 'Partager la citation',
        'task.delete': 'Supprimer la tâche',
      },
      moods: ['Radieux', 'Calme', 'Anxieux', 'Abattu', 'Débordé'],
      grounding: [
        { sense: 'voir', prompt: 'Nommez cinq choses que vous voyez.' },
        { sense: 'toucher', prompt: 'Notez quatre choses que vous pouvez toucher.' },
        { sense: 'entendre', prompt: 'Écoutez trois sons autour de vous.' },
        { sense: 'sentir', prompt: 'Trouvez deux odeurs autour de vous.' },
        { sense: 'goûter', prompt: 'Remarquez une chose que vous pouvez goûter.' }
      ],
      affirmations: [
        'Vous pouvez recommencer doucement.',
        'Les petites étapes comptent aussi.',
        'Vous pouvez vivre ce moment une respiration à la fois.',
        'Le repos fait partie du travail.',
        'Votre attention est précieuse.'
        , 'Sors de là.'
      ],
      affirmationPrefix: 'Affirmation',
      affirmationConnector: 'sur',
      pageTitle: 'My mindscape'
    },
    de: {
      locale: 'de-DE',
      title: 'My mindscape',
      text: {
        'overview.streakDays': 'Tage',
        'nav.overview': 'Übersicht',
        'nav.mood': 'Stimmung & Tagebuch',
        'nav.relief': 'Ruhe finden',
        'nav.focus': 'Fokusstudio',
        'sidebar.noteLabel': 'Eine sanfte Erinnerung',
        'sidebar.note': 'Du musst heute nicht alles schaffen.',
        'mobile.home': 'Start',
        'mobile.journal': 'Tagebuch',
        'mobile.calm': 'Ruhe',
        'mobile.focus': 'Fokus',
        'auth.login': 'Anmelden',
        'auth.clear': 'Daten löschen',
        'auth.eyebrow': 'Privater Raum',
        'auth.loginTitle': 'Bei My mindscape anmelden',
        'auth.subtitle': 'Bewahre deinen Fortschritt sicher auf.',
        'auth.email': 'E-Mail',
        'auth.password': 'Passwort',
        'auth.submit': 'Anmelden',
        'auth.create': 'Konto erstellen',
        'auth.supabaseTitle': 'Lokale Anmeldung',
        'auth.supabaseNote': 'Deine Sitzung wird in diesem Browser gespeichert.',
        'auth.signout': 'Abmelden',
        'auth.completeForm': 'Bitte fülle das Kontenformular aus.',
        'auth.enterDetails': 'Bitte gib deine Daten ein.',
        'auth.accountCreated': 'Konto erfolgreich erstellt.',
        'auth.checkEmail': 'Konto erstellt. Prüfe deine E-Mail, um dein Konto vor der Anmeldung zu bestätigen.',
        'auth.welcomeBack': 'Willkommen zurück.',
        'task.empty': 'Deine Liste ist leer. Was fühlt sich machbar an?',
        'quick.empty': 'Der nächste Schritt kann klein sein.',
        'journal.empty': 'Deine privaten Reflexionen erscheinen hier.',
        'journal.entry': 'Eintrag',
        'journal.entries': 'Einträge',
        'report.title': 'Dein persönlicher Bericht',
        'report.note': 'Lade eine private Wellness-Zusammenfassung deiner gespeicherten Check-ins herunter.',
        'report.button': 'PDF herunterladen',
        'friends.title': 'Freunde',
        'friends.empty': 'Noch keine Freunde hinzugefügt.',
        'friendName': 'Name des Freundes',
        'friendContact': 'Kontaktdaten',
        'friendAddPhoto': 'Foto hinzufügen',
        'friendAdd': 'Freund hinzufügen',
        'friendRemove': 'Freunde entfernen',
        'friendSave': 'Freund speichern',
        'friendEdit': 'Freund bearbeiten',
        'friendContactLabel': 'Kontaktdaten',
        'friendAddPrompt': 'Füge zuerst Name und Kontakt hinzu.',
        'report.downloaded': 'PDF-Bericht gespeichert.',
        'journal.saved': 'Dein Check-in wurde privat gespeichert.',
        'task.saved': 'Ein kleiner Schritt wurde hinzugefügt.',
        'task.complete': 'Aufgabe abgeschlossen.',
        'auth.error.invalid': 'E-Mail oder Passwort ungültig.',
        'auth.error.exist': 'Diese E-Mail gibt es bereits. Versuche dich anzumelden.',
        'auth.error.general': 'Diese Aktion konnte nicht abgeschlossen werden.',
        'signIn': 'Anmelden',
        'signOut': 'Abmelden',
        'page.overview': 'Guten Morgen, Freund.',
        'page.mood': 'Ein Moment der Ehrlichkeit.',
        'page.relief': 'Komm wieder in deinen Körper.',
        'page.focus': 'Mach Fokus ein bisschen sanfter.',
        'streak.title': 'Tägliche Check-in-Serie',
        'streak.subtitle': 'Zeig dich weiterhin sanft, einen Tag nach dem anderen.',
        'streak.label': 'Tage',
        'prompt.placeholder': 'Was fühlt sich als Nächstes machbar an?',
        'prompt.add': 'Hinzufügen',
        'friend.select': 'Freund auswählen',
        'friend.chat': 'Private Unterhaltung',
        'friend.circle': 'Dein Kreis',
        'friend.noMessage': 'Noch keine Nachrichten. Sag Hallo.',
        'friend.emptyChat': 'Füge einen Freund hinzu, um zu chatten.'
      ,
        'auth.cancel': 'Abbrechen',
        'auth.dataCleared': 'Abgemeldet und lokale Daten gelöscht.',
        'auth.emailPlaceholder': 'du@beispiel.de',
        'auth.firstName': 'Vorname',
        'auth.firstNamePlaceholder': 'Vorname',
        'auth.lastName': 'Nachname',
        'auth.lastNamePlaceholder': 'Nachname',
        'auth.logoutAndClear': 'Abmelden und alle Daten löschen',
        'auth.logoutDescription': 'Wähle, was mit den in diesem Browser gespeicherten Daten geschehen soll.',
        'auth.logoutOnly': 'Abmelden und Daten behalten',
        'auth.logoutTitle': 'Abmelden',
        'auth.mode': 'Kontomodus',
        'auth.passwordPlaceholder': 'Mindestens 6 Zeichen',
        'auth.reason': 'Warum bist du hier?',
        'auth.reasonChoose': 'Wähle, was am meisten helfen würde...',
        'auth.reasonPlaceholder': 'Ein paar Worte dazu, wobei du Unterstützung brauchst.',
        'auth.signInOption': 'Anmelden',
        'auth.signInRequired': 'Melde dich an, um diese Funktion zu nutzen.',
        'auth.signUpOption': 'Konto erstellen',
        'auth.signedOut': 'Du wurdest abgemeldet.',
        'auth.signupSubmit': 'Konto erstellen',
        'auth.signupTitle': 'Ein My-mindscape-Konto erstellen',
        'auth.switchToLogin': 'Ich habe bereits ein Konto',
        'brand.tagline': 'dein sanfterer Raum',
        'breath.follow': 'Folge dem Kreis in deinem eigenen Tempo.',
        'breath.instructions.exhale': 'Ausatmen',
        'breath.instructions.hold': 'Halten',
        'breath.instructions.inhale': 'Einatmen',
        'breath.paused': 'Pausiert',
        'breath.ready': 'Bereit?',
        'breath.round': 'Runde {n}',
        'breath.second': 'Sekunde',
        'breath.seconds': 'Sekunden',
        'focus.addTask': 'Aufgabe hinzufügen',
        'focus.cafe': 'Café-Atmosphäre',
        'focus.clear': 'Leeren',
        'focus.deepFocus': 'Tiefe Konzentration',
        'focus.eyebrow': 'Lern- und Fokusbegleiter',
        'focus.focusWindow': 'Du befindest dich in deinem Fokusfenster',
        'focus.gentleRain': 'Sanfter Regen',
        'focus.listEmpty': 'Deine Liste ist leer. Was würde sich gut anfühlen zu erledigen?',
        'focus.listLabel': 'Deine Liste',
        'focus.listPlaceholder': 'Füge einen machbaren nächsten Schritt hinzu...',
        'focus.listTitle': 'Kleine Schritte zählen',
        'focus.live': 'Live',
        'focus.longBreak': 'Lange Pause',
        'focus.longReset': 'Langer Neustart',
        'focus.notes': 'Notizen',
        'focus.pauseTimer': 'Timer pausieren',
        'focus.planPlaceholder': 'Eine Sache, die ich als Nächstes tun kann...',
        'focus.pomodoro': 'Pomodoro',
        'focus.quickPlan': 'Schnellplan',
        'focus.ready': 'Bereit, wenn du es bist',
        'focus.reset': 'Zurücksetzen',
        'focus.resetMoment': 'Ein Moment zum Zurücksetzen',
        'focus.resume': 'Timer fortsetzen',
        'focus.shortBreak': 'Kurze Pause',
        'focus.shortReset': 'Kurzer Neustart',
        'focus.soundLabel': 'Bereite den Raum vor',
        'focus.soundscape': 'Klanglandschaft',
        'focus.startTimer': 'Timer starten',
        'focus.subtitle': 'Ein klarer nächster Schritt, ein begrenztes Zeitfenster, eine sanfte Landung.',
        'focus.title': 'Mach Fokussieren angenehmer.',
        'focus.volume': 'Lautstärke',
        'focus.whiteNoise': 'Weißes Rauschen',
        'focus.windowComplete': 'Zeitfenster abgeschlossen',
        'focus.work': 'Arbeit',
        'friends.instagram': 'Instagram',
        'friends.phone': 'Telefon',
        'friends.whatsapp': 'WhatsApp',
        'grounding.complete': 'Du bist zurück in der Gegenwart angekommen.',
        'grounding.progress': '{done} von 5 erledigt',
        'journal.quietCheckin': 'Ruhiger Check-in.',
        'language.label': 'Sprache',
        'mood.chooseFit': 'Wähle das, was am ehesten passt',
        'mood.eyebrow': 'Emotionales Wetter',
        'mood.label': 'Setze ein paar Worte dazu (optional)',
        'mood.optional': '(optional)',
        'mood.placeholder': 'Was nimmt gerade Raum in deinen Gedanken ein?',
        'mood.prompt1': 'Für welche 3 Dinge bist du gerade dankbar?',
        'mood.prompt2': 'Was würde die nächste Stunde 1 % leichter machen?',
        'mood.prompt3': 'Was musst du heute hören?',
        'mood.promptsLabel': 'Geführte Impulse...',
        'mood.recentNotes': 'Deine letzten Notizen',
        'mood.save': 'Check-in speichern',
        'mood.subtitle': 'Ein Check-in ist eine Information, kein Urteil.',
        'mood.title': 'Wie fühlt es sich innerlich an?',
        'overview.affirmationCount': 'Affirmation 1 von 5',
        'overview.taskCount': '{count} übrig',
        'relief.breathIntro': 'Box-Atmung',
        'relief.breathText': 'Vier gleiche Seiten. Ein beruhigender Rhythmus.',
        'relief.breathTitle': '01 / Atem',
        'relief.eyebrow': 'Regulieren & zurückkehren',
        'relief.pause': 'Pause',
        'relief.progressLabel': '{done} von 5 erledigt',
        'relief.ready': 'Bereit',
        'relief.reset': 'Zurücksetzen',
        'relief.senseText': 'Nutze deine Sinne, um dich im gegenwärtigen Moment zu verankern.',
        'relief.senseTitle': '5-4-3-2-1-Erdung',
        'relief.senses': '02 / Sinne',
        'relief.start': 'Mit dem Atmen beginnen',
        'relief.subtitle': 'Wähle eine Übung. Du kannst jederzeit aufhören, wenn du musst.',
        'relief.title': 'Ein bisschen mehr Leichtigkeit.',
        'report.nextStep': 'Sanfter nächster Schritt: Tu eine kleine Sache und erlaube dir, dich auszuruhen.',
        'report.quietReflection': 'Ruhige Reflexion',
        'report.unavailable': 'Die PDF-Bibliothek ist in diesem Browser nicht verfügbar.',
        'share.quote': 'Zitat teilen',
        'task.delete': 'Aufgabe löschen',
      },
      moods: ['Strahlend', 'Ruhig', 'Besorgt', 'Niedergeschlagen', 'Überfordert'],
      grounding: [
        { sense: 'sehen', prompt: 'Nenne fünf Dinge, die du siehst.' },
        { sense: 'fühlen', prompt: 'Achte auf vier Dinge, die du fühlst.' },
        { sense: 'hören', prompt: 'Hör drei Dinge, die du hörst.' },
        { sense: 'riechen', prompt: 'Finde zwei Dinge, die du riechst.' },
        { sense: 'schmecken', prompt: 'Beachte etwas, das du schmeckst.' }
      ],
      affirmations: [
        'Du darfst sanft neu beginnen.',
        'Kleine Schritte sind auch Bewegung.',
        'Du kannst diesen Moment eine Atemzug nach dem anderen meistern.',
        'Pause ist Teil der Arbeit.',
        'Deine Aufmerksamkeit ist wertvoll.'
        , 'Komm da raus.'
      ],
      affirmationPrefix: 'Bestätigung',
      affirmationConnector: 'von',
      pageTitle: 'My mindscape'
    },
    ts: {
      locale: 'ts-ZA',
      title: 'My mindscape',
      weekdays: ['Sonto', 'Musumbhunuku', 'Ravumbirhi', 'Ravunharhu', 'Ravumune', 'Ravuntlhanu', 'Mugqivela'],
      weekdaysShort: ['Son', 'Mus', 'Rav', 'Rav', 'Rav', 'Rav', 'Mug'],
      months: ['Sunguti', 'Nyenyankulu', 'Nyenyenyana', 'Dzivamisoko', 'Mudyaxihi', 'Khotavuxika', 'Mhawuri', 'Ndzati', 'Nhlangula', 'Nhlangula', 'Hukuri', "N'wendzamhala"],
      text: {
        'brand.tagline': 'ndhawu ya wena yo olova',
        'language.label': 'Ririmi',
        'auth.mode': 'Muxaka wa akhawunti',
        'auth.signInOption': 'Nghena',
        'auth.signUpOption': 'Tumbuluxa akhawunti',
        'auth.firstName': 'Vito',
        'auth.firstNamePlaceholder': 'Vito',
        'auth.lastName': 'Vito ra ndyangu',
        'auth.lastNamePlaceholder': 'Vito ra ndyangu',
        'auth.reason': 'Hikwalaho ka yini u ri laha?',
        'auth.reasonPlaceholder': 'Marito ma nga ri mangani hi nseketelo lowu u wu lavaka.',
          'auth.reasonChoose': 'Hlawula leswi nga ku pfunaka swinene...',
        'auth.emailPlaceholder': 'wena@example.com',
        'auth.passwordPlaceholder': 'Swikombiso swa 6 kumbe ku tlurisa',
        'overview.pauseLabel': 'Ku yima ka namuntlha',
        'overview.affirmationCount': 'Xikombiso 1 xa 5',
        'overview.rhythm': 'Ndzavisiso wa wena',
        'overview.thisWeek': 'Vhiki leri',
        'overview.makeRoom': 'Endla ndhawu ya wena',
        'overview.needNow': 'U lava yini sweswi?',
        'overview.checkInTitle': 'Tshama u kambela',
        'overview.checkInText': 'Vula leswi nga kona, handle ka ku avanyisa.',
        'overview.checkInAction': 'Pfula dayari →',
        'overview.calmTitle': 'Kuma ku rhula',
        'overview.calmText': 'Nhlisa ku hefemula ka wena u tlhela u vuya.',
        'overview.calmAction': 'Ringeta ntolovelo →',
        'overview.focusTitle': 'Ku kongomisa hi ku olova',
        'overview.focusText': 'Tumbuluxa ku ya mahlweni kutsongo, hi ndlela ya wena.',
        'overview.focusAction': 'Pfula studio →',
        'overview.smallThingTitle': 'Nchumu wun’we lowutsongo',
        'overview.smallThingText': 'Hlawula ntirho lowu vonakaka wu koteka.',
        'overview.smallThingAction': 'Engetela ntirho →',
        'overview.noticeTitle': 'Nkarhi wa ku xiya',
        'overview.noticeText': 'A ku na ndlela leyi hetisekeke yo tirhisa ndhawu leyi. Landzela leswi ku seketelaka.',
        'overview.streakTitle': 'Ku landzelelana ka ku kambela siku na siku',
        'overview.streakText': 'Yana u humelela hi ku olova, siku rin’wana ni rin’wana.',
        'overview.streakLabel': 'masiku',
        'overview.taskLabel': 'Goza rin’we leritsongo',
        'overview.taskTitle': 'Nongonoko wa mintirho wo rhula',
        'overview.taskPlaceholder': 'I yini lexi vonakaka xi koteka sweswi?',
        'overview.taskAdd': 'Engetela',
        'overview.taskCount': '{count} leswi saleke',
        'overview.reportTitle': 'Xiviko xa wena xa munhu',
        'overview.reportText': 'Landa nkatsakanyo wa vutshunguri bya wena lowu humaka eka ku kambela loku hlayisiweke.',
        'overview.reportButton': 'Landa PDF',
        'friends.circleLabel': 'Ntlawa wa wena',
        'friends.title': 'Vanghana',
        'friends.namePlaceholder': 'Vito ra munghana',
        'friends.contactPlaceholder': 'Vuxokoxoko bya vuhlanganisi',
        'friends.addPhoto': 'Engetela xifaniso',
        'friends.addFriend': 'Engetela munghana',
        'friends.removeSelected': 'Susa loyi a hlawuriweke',
        'friends.whatsapp': 'WhatsApp',
        'friends.instagram': 'Instagram',
        'friends.phone': 'Riqingho',
        'mood.eyebrow': 'Boha bya le ndzeni',
        'mood.title': 'U titwa yini endzeni?',
        'mood.subtitle': 'Ku kambela i mahungu, a hi ku avanyisa.',
        'mood.chooseFit': 'Hlawula leswi tshinelaka swinene',
        'mood.label': 'Veka marito ma nga ri mangani',
        'mood.optional': '(swa ku hlawula)',
        'mood.placeholder': 'I yini lexi tateke miehleketo ya wena?',
        'mood.promptsLabel': 'Swivutiso leswi kongomisaka...',
        'mood.prompt1': 'Hi swihi swilo swinharhu leswi u swi tlangelaka sweswi?',
        'mood.prompt2': 'I yini lexi nga endla awara leyi landzelaka yi olova hi 1%?',
        'mood.prompt3': 'U lava ku twa yini namuntlha?',
        'mood.save': 'Hlayisa ku kambela',
        'mood.recentNotes': 'Tinotsi ta wena ta sweswi',
        'relief.eyebrow': 'Lulamisa u tlhela u vuya',
        'relief.title': 'Ku olova katsongo.',
        'relief.subtitle': 'Hlawula ntolovelo wun’we. U nga yima loko u swi lava.',
        'relief.breathTitle': '01 / Ku hefemula',
        'relief.breathIntro': 'Ku hefemula ka bokisi',
        'relief.breathText': 'Matlhelo ya mune lama ringanaka. Ntolovelo wo tiyisa.',
        'relief.ready': 'Swi lulamile',
        'relief.start': 'Sungula ku hefemula',
        'relief.pause': 'Yimisa',
        'relief.senses': '02 / Matitwelo',
        'relief.senseTitle': 'Ku dzima 5-4-3-2-1',
        'relief.senseText': 'Tirhisa matitwelo ya wena ku vuya eka nkarhi wa sweswi.',
        'relief.reset': 'Sungula nakambe',
        'grounding.progress': '{done} eka 5 swi hetisekile',
        'grounding.complete': 'U tlhelele eka sweswi.',
        'focus.eyebrow': 'Nkulukumba wa dyondzo ni ku kongomisa',
        'focus.title': 'Endla ku kongomisa ku va ko olova.',
        'focus.subtitle': 'Goza leri landzelaka leri nga erivaleni, nkarhi lowu pimiweke, ni ku wisanyana.',
        'focus.pomodoro': 'Pomodoro',
        'focus.work': 'Ntirho',
        'focus.shortBreak': 'Ku wisa kutsongo',
        'focus.longBreak': 'Ku wisa nkarhi wo leha',
        'focus.deepFocus': 'Ku kongomisa swinene',
        'focus.shortReset': 'Ku sungula nakambe kutsongo',
        'focus.longReset': 'Ku sungula nakambe nkarhi wo leha',
        'focus.ready': 'Swi lulamile loko u ri kona',
        'focus.startTimer': 'Sungula xikomba-nkarhi',
        'focus.reset': 'Sungula nakambe',
        'focus.soundscape': 'Mimpfumawulo ya ndhawu',
        'focus.soundLabel': 'Lulamisa ndhawu',
        'focus.live': 'Swa hanya',
        'focus.volume': 'Mpfumawulo',
        'focus.whiteNoise': 'Mpfumawulo wo basa',
        'focus.gentleRain': 'Mpfula yo olova',
        'focus.cafe': 'Ndhawu ya kafe',
        'focus.listLabel': 'Nongonoko wa wena',
        'focus.listTitle': 'Magoza lamatsongo ma na nkoka',
        'focus.listPlaceholder': 'Engetela goza leri kotekaka leri landzelaka...',
        'focus.addTask': 'Engetela ntirho',
        'focus.listEmpty': 'Nongonoko wa wena wu basile. I yini lexi nga tsakisa ku xi heta?',
        'journal.quietCheckin': 'Ku kambela ko rhula.',
        'task.delete': 'Susa ntirho',
        'report.unavailable': 'Layiburari ya PDF a yi kumeki eka browser leyi.',
        'report.quietReflection': 'Miehleketo yo rhula',
        'report.nextStep': 'Goza leri olovaka: endla xilo xin’we lexitsongo u ti pfumelela ku wisa.',
        'breath.seconds': 'tisekoni',
        'breath.second': 'sekoni',
        'breath.instructions.inhale': 'Hefemula endzeni',
        'breath.instructions.hold': 'Khoma',
        'breath.instructions.exhale': 'Hefemula ehandle',
        'breath.round': 'Nkarhi wa {n}',
        'breath.paused': 'Yi yimisiwile',
        'breath.ready': 'Swi lulamile?',
        'breath.follow': 'Landzela xirhendzevutana hi rivilo ra wena.',
        'nav.overview': 'Nkoka',
        'nav.mood': 'Miehleketo & dayari',
        'nav.relief': 'Kuma ku hlomula',
        'nav.focus': 'Fokus studio',
        'sidebar.noteLabel': 'Ntsundzuko wa xitandza',
        'sidebar.note': 'A wu faneli ku endla hinkwaswo namuntlha.',
        'mobile.home': 'Yindlu',
        'mobile.journal': 'Dayari',
        'mobile.calm': 'Ku hlomula',
        'mobile.focus': 'Fokus',
        'auth.login': 'Nghena',
        'auth.clear': 'Susa data',
        'auth.eyebrow': 'Ndhawu ya xihundla',
        'auth.loginTitle': 'Nghena eka My mindscape',
        'auth.subtitle': 'Tihlayisa ku ya emahlweni kahle.',
        'auth.email': 'E-mail',
        'auth.password': 'Phasiwedi',
        'auth.submit': 'Nghena',
        'auth.create': 'Tumbuluxa akhawunti',
        'auth.supabaseTitle': 'Nghena loko ku ri kona',
        'auth.supabaseNote': 'Tsessioni ya wena yi hlayisiwa eka browser leyi.',
        'auth.signout': 'Hlamula',
        'auth.completeForm': 'Tatafule fomo ya akhawunti.',
        'auth.enterDetails': 'Tatafule vuxokoxoko bya wena.',
        'auth.logoutTitle': 'Hlamula eka akhawunti',
        'auth.logoutDescription': 'Hlawula leswi u lavaka ku swi endla hi data leyi hlayisiweke eka browser leyi.',
        'auth.logoutOnly': 'Hlamula u hlayisa data',
        'auth.logoutAndClear': 'Hlamula u susa data hinkwato',
        'auth.cancel': 'Tshika',
        'auth.signedOut': 'U humile eka akhawunti.',
        'auth.dataCleared': 'U humile naswona data ya laha yi susiwile.',
        'auth.signupTitle': 'Tumbuluxa akhawunti ya My mindscape',
        'auth.signupSubmit': 'Tumbuluxa akhawunti',
        'auth.switchToLogin': 'Se ndzi na akhawunti',
        'auth.accountCreated': 'Akhawunti yi endliwa kahle.',
        'auth.checkEmail': 'Akhawunti yi endliwile. Languta imeyili ya wena ku tiyisisa akhawunti u nga si nghena.',
        'auth.welcomeBack': 'Sawubona nakambe.',
        'task.empty': 'Nhlayo ya wena yi wume. Hi yini leyi tshembaka ku humelela?',
        'quick.empty': 'Xiphemu lexi landzelaka xi nga va xitsongo.',
        'journal.empty': 'Mikhuva ya wena yi ta vonakala laha.',
        'journal.entry': 'nhlamulo',
        'journal.entries': 'tinhlamulo',
        'report.title': 'Xipfuxo xa wena',
        'report.note': 'Londza xipfuxo xa miehleketo ya wena.',
        'report.button': 'Londza PDF',
        'friends.title': 'Vanghana',
        'friends.empty': 'A hu na vanghana lava engeteriweke.',
        'friendName': 'Vito ra munghana',
        'friendContact': 'Vutivi bya ku hlanganisa',
        'friendAddPhoto': 'Engetela xifaniso',
        'friendAdd': 'Engetela munghana',
        'friendRemove': 'Susa vanghana',
        'friendSave': 'Hlayisa profaele',
        'friendEdit': 'Lunghekisa munghana',
        'friendContactLabel': 'Vutivi bya ku hlanganisa',
        'friendAddPrompt': 'Engetela vito na vuxokoxoko ku sungula.',
        'report.downloaded': 'PDF yi hlayisiwe.',
        'journal.saved': 'Check-in yi hlayisiwile ku xihundla.',
        'task.saved': 'Xiphemu xitsongo xi engeteriwile.',
        'task.complete': 'Xintirhwana xi hetisekile.',
        'auth.error.invalid': 'E-mail kumbe phasiwedi a yi fanele.',
        'auth.error.exist': 'E-mail leyi yi nga kona. Ringeta ku nghena.',
        'auth.error.general': 'Nhlamulo a yi koteki.',
        'signIn': 'Nghena',
        'signOut': 'Hlamula',
        'page.overview': 'Moro, munghana.',
        'page.mood': 'Nkarhi wa ku va na ntiyiso.',
        'page.relief': 'Back to your body.',
        'page.focus': 'Endla fokus yi va nhova.',
        'streak.title': 'Nhlayo ya masiku yo landzananaka',
        'streak.subtitle': 'Yisa ku ya emahlweni hi ku xitandza, siku rin’we ni rin’we.',
        'streak.label': 'masiku',
        'prompt.placeholder': 'Hi yini lexi kombisaka ku kota ku endlela?',
        'prompt.add': 'Engetela',
        'friend.select': 'Hlawula munghana',
        'friend.chat': 'Ku vulavuriwa ka xihundla',
        'friend.circle': 'Nghingiriko wa wena',
        'friend.noMessage': 'A ku na swihunguti. Rhandza hello.',
        'friend.emptyChat': 'Engetela munghana ku sungula ku khulume.'
      ,
        'auth.signInRequired': 'Nghena eka akhawunti ku tirhisa nchumu lowu.',
        'focus.clear': 'Susa',
        'focus.focusWindow': 'U le ka nkarhi wa wena wo kongomisa',
        'focus.notes': 'Tinotsi',
        'focus.pauseTimer': 'Yimisa xikombankarhi',
        'focus.planPlaceholder': 'Xin\'we lexi ndzi nga xi endlaka ku landzela...',
        'focus.quickPlan': 'Kungu ro hatlisa',
        'focus.resetMoment': 'Nkarhi wo sungula nakambe',
        'focus.resume': 'Tlhandlukisa xikombankarhi',
        'focus.windowComplete': 'Nkarhi wu hetisekile',
        'relief.progressLabel': '{done} eka 5 swi hetisekile',
        'share.quote': 'Avelana xitatimende',
      },
      moods: ['Xa mahlo', 'Ku hlomula', 'Ku khoma', 'Ku hlangana', 'Ku herisa'],
      grounding: [
        { sense: 'vonela', prompt: 'Bula swilo swinharhu leswi u swi vonaka.' },
        { sense: 'khoma', prompt: 'Vona swilo mune leswi u swi khomaka.' },
        { sense: 'rhandza', prompt: 'Pfumela milawu mitatu leyi u yi rhwimisaka.' },
        { sense: 'fuma', prompt: 'Kuma leswi u swi fumanaka.' },
        { sense: 'luma', prompt: 'Vona xilo xin’we lexi u xi lumanaka.' }
      ],
      affirmations: [
        'U nga sungula nakambe hi ku xitandza.',
        'Mintirho yitsongo i ku famba.',
        'U nga kota ku kota ku endlela hi mpfumawulo wu un’we.',
        'Ku khuluka i xiphemu xa ntirho.',
        'Ntsundzuko wa wena i wa nkoka.'
        , 'Huma ka swona!'
      ],
      affirmationPrefix: 'Xikombiso',
      affirmationConnector: 'xa',
      pageTitle: 'My mindscape'
    },
    mkh: {
      locale: 'mkh-MZ',
      title: 'My mindscape',
      weekdays: ['Lamlungu', 'Lolemba', 'Lachiwiri', 'Lachitatu', 'Lachinayi', 'Lachisanu', 'Loweruka'],
      weekdaysShort: ['Lam', 'Lol', 'Lac2', 'Lac3', 'Lac4', 'Lac5', 'Low'],
      months: ['Januwale', 'Febuluwale', 'Malichi', 'Epulo', 'Meyi', 'Juni', 'Julayi', 'Ogasiti', 'Seputembala', 'Okotobala', 'Novembala', 'Disembala'],
      text: {
        'overview.streakDays': 'masiku',
        'nav.overview': 'Mawonero',
        'nav.mood': 'Moyo & kalata',
        'nav.relief': 'Pezani ntendere',
        'nav.focus': 'Studio ya kuyang’ana',
        'sidebar.noteLabel': 'Zindikirani',
        'sidebar.note': 'Muyenera kutokha zonse lero.',
        'mobile.home': 'Nyumba',
        'mobile.journal': 'Kalata',
        'mobile.calm': 'Ntendere',
        'mobile.focus': 'Kuyang’ana',
        'auth.login': 'Lowani',
        'auth.clear': 'Fufuzani data',
        'auth.eyebrow': 'Malo wa paumwini',
        'auth.loginTitle': 'Lowani ku My mindscape',
        'auth.subtitle': 'Sungirani zotsatira zanu ndiotetezeka.',
        'auth.email': 'E-mail',
        'auth.password': 'Mawu a chinsinsi',
        'auth.submit': 'Lowani',
        'auth.create': 'Pangani akaunti',
        'auth.supabaseTitle': 'Lowani pa kompyuta',
        'auth.supabaseNote': 'Sesi yanu ijaŵikidwa mu browser ino.',
        'auth.signout': 'Tulukani',
        'auth.completeForm': 'Chonde lembani fomu ya akaunti.',
        'auth.enterDetails': 'Chonde lembani zambiri zanu.',
        'auth.accountCreated': 'Akaunti yapangidwa bwino.',
        'auth.checkEmail': 'Akaunti yapangidwa. Yang’anani imelo yanu kuti mutsimikizire akaunti musanalowe.',
        'auth.welcomeBack': 'Takulandilani kubwerera.',
        'task.empty': 'Mndandanda wanu uli wopanda kanthu. N’chiyani chomwe chingatheke?',
        'quick.empty': 'Chinthu chotsatira chikhoza kukhala chaching’ono.',
        'journal.empty': 'Zolingalira zanu zizaoneka pano.',
        'journal.entry': 'zolowa',
        'journal.entries': 'zolowa',
        'report.title': 'Lipoti lanu',
        'report.note': 'Tsitsani mwachinsinsi za thanzi lanu.',
        'report.button': 'Tsitsani PDF',
        'friends.title': 'Anzanu',
        'friends.empty': 'Alibe anzanu owonjezera.',
        'friendName': 'Dzina la mnzanu',
        'friendContact': 'Zolumikizirana',
        'friendAddPhoto': 'Onjezani chithunzi',
        'friendAdd': 'Onjezani mnzanu',
        'friendRemove': 'Chotsani anzanu',
        'friendSave': 'Sungani mbiri',
        'friendEdit': 'Sinthani mnzanu',
        'friendContactLabel': 'Zolumikizirana',
        'friendAddPrompt': 'Onjezani dzina ndi zoyankhulana.',
        'report.downloaded': 'PDF ya lipoti yasungidwa.',
        'journal.saved': 'Check-in yanu yasungidwa mwachinsinsi.',
        'task.saved': 'Chinthu chaching’ono chawonjezedwa.',
        'task.complete': 'Ntchito yaphedwa.',
        'auth.error.invalid': 'E-mail kapena mawu achinsinsi simakonzeka.',
        'auth.error.exist': 'E-mail iyi ilipo kale. Yesaninso kutenga.',
        'auth.error.general': 'Izi sizinatha kukwaniritsidwa.',
        'signIn': 'Lowani',
        'signOut': 'Tulukani',
        'page.overview': 'Mwau, mnzanga.',
        'page.mood': 'Nkhani ya kuonetsana.',
        'page.relief': 'Bwerani mwa thupi lanu.',
        'page.focus': 'Pangani kuyang’ana kukhala kosavuta.',
        'streak.title': 'Kuyenda kwa masiku',
        'streak.subtitle': 'Pitilirani mosamala, tsiku limodzi pa tsiku.',
        'streak.label': 'masiku',
        'prompt.placeholder': 'N’chiyani chomwe chikuwoneka kukhala chotheka?',
        'prompt.add': 'Onjezani',
        'friend.select': 'Sankhani mnzanu',
        'friend.chat': 'Kukambirana paumwini',
        'friend.circle': 'Gulu lanu',
        'friend.noMessage': 'Palibe mauthenga. Tiwuzeni hello.',
        'friend.emptyChat': 'Onjezani mnzanu kuti mutange kukambirana.'
      ,
        'auth.cancel': 'Lekani',
        'auth.dataCleared': 'Mwatuluka ndipo data ya pano yachotsedwa.',
        'auth.emailPlaceholder': 'inu@chitsanzo.com',
        'auth.firstName': 'Dzina loyamba',
        'auth.firstNamePlaceholder': 'Dzina loyamba',
        'auth.lastName': 'Dzina lomaliza',
        'auth.lastNamePlaceholder': 'Dzina lomaliza',
        'auth.logoutAndClear': 'Tulukani ndipo chotsani data zonse',
        'auth.logoutDescription': 'Sankhani chomwe mufuna kuchita ndi data yosungidwa mu browser ino.',
        'auth.logoutOnly': 'Tulukani kusiya data',
        'auth.logoutTitle': 'Tulukani',
        'auth.mode': 'Mtundu wa akaunti',
        'auth.passwordPlaceholder': 'Zosachepera 6',
        'auth.reason': 'Mwabwera nichani pano?',
        'auth.reasonChoose': 'Sankhani chomwe chingathandize kwambiri...',
        'auth.reasonPlaceholder': 'Mawu ochepa za thandizo lomwe mukufuna.',
        'auth.signInOption': 'Lowani',
        'auth.signInRequired': 'Lowani kuti mugwiritse ntchito ichi.',
        'auth.signUpOption': 'Pangani akaunti',
        'auth.signedOut': 'Mwatuluka.',
        'auth.signupSubmit': 'Pangani akaunti',
        'auth.signupTitle': 'Pangani akaunti ya My mindscape',
        'auth.switchToLogin': 'Ndili ndi akaunti kale',
        'brand.tagline': 'malo anu ofewa',
        'breath.follow': 'Tsatirani bwalo pa liwiro lanu.',
        'breath.instructions.exhale': 'Tulutsani mpweya',
        'breath.instructions.hold': 'Sungani',
        'breath.instructions.inhale': 'Pumani mpweya',
        'breath.paused': 'Zayimitsidwa',
        'breath.ready': 'Mwakonzeka?',
        'breath.round': 'Mzere {n}',
        'breath.second': 'sekondi',
        'breath.seconds': 'masekondi',
        'focus.addTask': 'Onjezani ntchito',
        'focus.cafe': 'Mawonekedwe a kafe',
        'focus.clear': 'Chotsani',
        'focus.deepFocus': 'Kuyang\'ana kwakuya',
        'focus.eyebrow': 'Mnzanu wa maphunziro ndi kuyang\'ana',
        'focus.focusWindow': 'Muli mkati mwa nthawi yanu yakuyang\'ana',
        'focus.gentleRain': 'Mvula yofewa',
        'focus.listEmpty': 'Mndandanda wanu uli wopanda kanthu. N\'chiyani chomwe chingakomere kumaliza?',
        'focus.listLabel': 'Mndandanda wanu',
        'focus.listPlaceholder': 'Onjezani gawo lotsatira lomwe lingatheke...',
        'focus.listTitle': 'Zochepa zimathandiza',
        'focus.live': 'Zikuchitika',
        'focus.longBreak': 'Kupuma kwakutali',
        'focus.longReset': 'Kuyambanso kwakutali',
        'focus.notes': 'Zolemba',
        'focus.pauseTimer': 'Imitsani wotchi',
        'focus.planPlaceholder': 'Chinthu chimodzi chomwe ndingachite chotsatira...',
        'focus.pomodoro': 'Pomodoro',
        'focus.quickPlan': 'Dongosolo lachangu',
        'focus.ready': 'Zakonzeka mukakhala okonzeka',
        'focus.reset': 'Yambaninso',
        'focus.resetMoment': 'Nthawi yoyambiranso',
        'focus.resume': 'Pitirizani wotchi',
        'focus.shortBreak': 'Kupuma kwakufupi',
        'focus.shortReset': 'Kuyambanso kwakufupi',
        'focus.soundLabel': 'Konzani malo',
        'focus.soundscape': 'Maliseche a malo',
        'focus.startTimer': 'Yambitsani wotchi',
        'focus.subtitle': 'Gawo lotsatira lomveka bwino, nthawi yoyezedwa, ndi kupumula modekha.',
        'focus.title': 'Pangani kuyang\'ana kukhala kofatsa.',
        'focus.volume': 'Kukweza kwa liwu',
        'focus.whiteNoise': 'Phokoso loyera',
        'focus.windowComplete': 'Nthawi yamaliza',
        'focus.work': 'Ntchito',
        'friends.instagram': 'Instagram',
        'friends.phone': 'Foni',
        'friends.whatsapp': 'WhatsApp',
        'grounding.complete': 'Mwabwerera ku nthawi ino.',
        'grounding.progress': '{done} mwa 5 amalizidwa',
        'journal.quietCheckin': 'Check-in modekha.',
        'language.label': 'Chinenero',
        'mood.chooseFit': 'Sankhani chomwe chikugwirizana kwambiri',
        'mood.eyebrow': 'Nyengo yamaganizidwe',
        'mood.label': 'Ikani mawu ochepa (osafunikira)',
        'mood.optional': '(osafunikira)',
        'mood.placeholder': 'N\'chiyani chomwe chikudzaza maganizo anu?',
        'mood.prompt1': 'N\'zinthu ziti 3 zomwe mukuyamikira pano?',
        'mood.prompt2': 'N\'chiyani chingapangitse ola lotsatira kukhala losavuta 1%?',
        'mood.prompt3': 'N\'chiyani chomwe mukufuna kumva lero?',
        'mood.promptsLabel': 'Malingaliro otsogolera...',
        'mood.recentNotes': 'Zolemba zanu zaposachedwa',
        'mood.save': 'Sungani check-in',
        'mood.subtitle': 'Check-in ndi uthenga, osati chiweruzo.',
        'mood.title': 'Mukumva bwanji mkati?',
        'overview.affirmationCount': 'Mau olimbikitsa 1 mwa 5',
        'overview.taskCount': '{count} zotsala',
        'relief.breathIntro': 'Kupuma kwa bokosi',
        'relief.breathText': 'Mbali zinayi zofanana. Kamvedwe kokhazikitsa.',
        'relief.breathTitle': '01 / Kupuma',
        'relief.eyebrow': 'Khazikitsani ndi bwererani',
        'relief.pause': 'Imani',
        'relief.progressLabel': '{done} mwa 5 amalizidwa',
        'relief.ready': 'Zakonzeka',
        'relief.reset': 'Yambaninso',
        'relief.senseText': 'Gwiritsani ntchito ziwalo zanu kuti mukhazikike pa nthawi ino.',
        'relief.senseTitle': 'Kukhazikika 5-4-3-2-1',
        'relief.senses': '02 / Ziwalo',
        'relief.start': 'Yambani kupuma',
        'relief.subtitle': 'Sankhani chizolowezi chimodzi. Mutha kuima nthawi iliyonse mukafunikira.',
        'relief.title': 'Mtendere wowonjezera.',
        'report.nextStep': 'Gawo lofatsa lotsatira: chitani kanthu kakang\'ono ndipo lolani kupumula.',
        'report.quietReflection': 'Kulingalira modekha',
        'report.unavailable': 'Laibulale ya PDF sipezeka mu browser ino.',
        'share.quote': 'Gawani mawu',
        'task.delete': 'Chotsani ntchito',
      },
      moods: ['Woŵala', 'Wamtendere', 'Wopanikizika', 'Wotsika', 'Wokakamizika'],
      grounding: [
        { sense: 'kuona', prompt: 'Tchulani zinthu zisanu zomwe muwona.' },
        { sense: 'kukhudza', prompt: 'Lembani zinthu zinayi zomwe mumakhudza.' },
        { sense: 'kumva', prompt: 'Mverani zinthu zitatu zomwe mumamva.' },
        { sense: 'kununkhira', prompt: 'Pezani zinthu ziwiri zomwe muxamva.' },
        { sense: 'kudya', prompt: 'Chonde chinthu chimodzi chomwe mukumva.' }
      ],
      affirmations: [
        'Mutha kuyamba omasuka.',
        'Zing’onozing’ono ziri kupitilira.',
        'Mutha kuthana ndi nthawi iyi m’kupuma kamodzi.',
        'Kupumula ndi gawo la ntchito.',
        'Mawonedwe anu ndi ofunika.'
        , 'Choka mmo.'
      ],
      affirmationPrefix: 'Zikumbutso',
      affirmationConnector: 'pa',
      pageTitle: 'My mindscape'
    },
    sn: {
      locale: 'sn-ZW',
      title: 'My mindscape',
      weekdays: ['Svondo', 'Muvhuro', 'Chipiri', 'Chitatu', 'China', 'Chishanu', 'Mugovera'],
      weekdaysShort: ['Svo', 'Muv', 'Chi2', 'Chi3', 'Chi4', 'Chi5', 'Mug'],
      months: ['Ndira', 'Kukadzi', 'Kurume', 'Kubvumbi', 'Chivabvu', 'Chikumi', 'Chikunguru', 'Nyamavhuvhu', 'Gunyana', 'Gumiguru', 'Mbudzi', 'Zvita'],
      text: {
        'overview.streakDays': 'mazuva',
        'nav.overview': 'Mafungiro',
        'nav.mood': 'Moyo & zinyorwa',
        'nav.relief': 'Tsvaga rugare',
        'nav.focus': 'Studio yefocus',
        'sidebar.noteLabel': 'Chikumbiro chinyoro',
        'sidebar.note': 'Hazvidi kuti uite zvese nhasi.',
        'mobile.home': 'Kumba',
        'mobile.journal': 'Zinyorwa',
        'mobile.calm': 'Rugare',
        'mobile.focus': 'Focus',
        'auth.login': 'Pinda',
        'auth.clear': 'Bvisa data',
        'auth.eyebrow': 'Nharaunda yega',
        'auth.loginTitle': 'Pinda ku My mindscape',
        'auth.subtitle': 'Chengetedza kufambira kwako zvakachengeteka.',
        'auth.email': 'E-mail',
        'auth.password': 'Pasiwedhi',
        'auth.submit': 'Pinda',
        'auth.create': 'Gadzira account',
        'auth.supabaseTitle': 'Login yemuno',
        'auth.supabaseNote': 'Session yako inogadzirwa mubrowser ino.',
        'auth.signout': 'Buda',
        'auth.completeForm': 'Zadzisa fomu yeaccount.',
        'auth.enterDetails': 'Tapota isa ruzivo rwako.',
        'auth.accountCreated': 'Account yapedzwa zvinobudirira.',
        'auth.checkEmail': 'Account yagadzirwa. Tarisa email yako kuti usimbise account usati wapinda.',
        'auth.welcomeBack': 'Kugashira kudzoka.',
        'task.empty': 'Runyorwa rwako rwuzere. Ndechipi chingaita?',
        'quick.empty': 'Chinotevera chingave chiri chidiki.',
        'journal.empty': 'Mafungiro ako achaonekwa pano.',
        'journal.entry': 'zvinyorwa',
        'journal.entries': 'zvinyorwa',
        'report.title': 'Report yako',
        'report.note': 'Dhawunirodha pfupiso yekufunga nezve upenyu hwako.',
        'report.button': 'Dhawunirodha PDF',
        'friends.title': 'Shamwari',
        'friends.empty': 'Hapana shamwari dzakawedzerwa.',
        'friendName': 'Zita reshamwari',
        'friendContact': 'Contact details',
        'friendAddPhoto': 'Wedzera mufananidzo',
        'friendAdd': 'Wedzera shamwari',
        'friendRemove': 'Bvisa shamwari',
        'friendSave': 'Chengetedza profile',
        'friendEdit': 'Gadzirisa shamwari',
        'friendContactLabel': 'Contact details',
        'friendAddPrompt': 'Wedzera zita necontact kutanga.',
        'report.downloaded': 'PDF report yachengetedzwa.',
        'journal.saved': 'Check-in yako yakachengetedzwa zvakavanzika.',
        'task.saved': 'Chinhu chidiki chawedzerwa.',
        'task.complete': 'Basa rapera.',
        'auth.error.invalid': 'E-mail kana pasiwedhi hachibvumirwe.',
        'auth.error.exist': 'E-mail iyi iripo. Edza kupinda.',
        'auth.error.general': 'Ichi chiito hachina kukwanisa kupera.',
        'signIn': 'Pinda',
        'signOut': 'Buda',
        'page.overview': 'Moro shamwari.',
        'page.mood': 'Chikamu chenguva yehunhu.',
        'page.relief': 'Dzokera mutumbi wako.',
        'page.focus': 'Ita kuti focus ive nyororo.',
        'streak.title': 'Mazuva ekutarisa',
        'streak.subtitle': 'Ramba uchichengeta rugare, zuva nezuva.',
        'streak.label': 'mazuva',
        'prompt.placeholder': 'Ndechipi chiri kuita nyore kutevera?',
        'prompt.add': 'Wedzera',
        'friend.select': 'Sarudza shamwari',
        'friend.chat': 'Kukurukurirana kwakasarudzika',
        'friend.circle': 'Boka rako',
        'friend.noMessage': 'Hapana meseji. Tiudze hello.',
        'friend.emptyChat': 'Wedzera shamwari kuti utange kutaura.'
      ,
        'auth.cancel': 'Kanzura',
        'auth.dataCleared': 'Wabuda uye data yepano yabviswa.',
        'auth.emailPlaceholder': 'iwe@muenzaniso.com',
        'auth.firstName': 'Zita rekutanga',
        'auth.firstNamePlaceholder': 'Zita rekutanga',
        'auth.lastName': 'Zita rekupedzisira',
        'auth.lastNamePlaceholder': 'Zita rekupedzisira',
        'auth.logoutAndClear': 'Buda uye bvisa data yese',
        'auth.logoutDescription': 'Sarudza zvaunoda kuita nedata yakachengetwa mubrowser ino.',
        'auth.logoutOnly': 'Buda uchisiya data',
        'auth.logoutTitle': 'Buda',
        'auth.mode': 'Chimiro cheaccount',
        'auth.passwordPlaceholder': 'Zvinhu zvisingaperi pa6',
        'auth.reason': 'Wauya nei pano?',
        'auth.reasonChoose': 'Sarudza chinhu chingabetsera zvakanyanya...',
        'auth.reasonPlaceholder': 'Mashoko mashoma pamusoro perutsigiro rwaunoda.',
        'auth.signInOption': 'Pinda',
        'auth.signInRequired': 'Pinda kuti ushandise chinhu ichi.',
        'auth.signUpOption': 'Gadzira account',
        'auth.signedOut': 'Wabuda.',
        'auth.signupSubmit': 'Gadzira account',
        'auth.signupTitle': 'Gadzira account yeMy mindscape',
        'auth.switchToLogin': 'Ndine account kare',
        'brand.tagline': 'nzvimbo yako inyoro',
        'breath.follow': 'Tevera denderedzwa nemwero wako.',
        'breath.instructions.exhale': 'Buritsa mweya',
        'breath.instructions.hold': 'Chengetedza',
        'breath.instructions.inhale': 'Pinza mweya',
        'breath.paused': 'Yamiswa',
        'breath.ready': 'Wagadzirira here?',
        'breath.round': 'Danho {n}',
        'breath.second': 'sekondi',
        'breath.seconds': 'masekondi',
        'focus.addTask': 'Wedzera basa',
        'focus.cafe': 'Mamiriro ekafe',
        'focus.clear': 'Bvisa',
        'focus.deepFocus': 'Focus yakadzama',
        'focus.eyebrow': 'Mubatsiri wekudzidza uye focus',
        'focus.focusWindow': 'Uri munguva yako yefocus',
        'focus.gentleRain': 'Mvura inyoro',
        'focus.listEmpty': 'Runyorwa rwako rwuzere. Ndechipi chingaita kuti unakidzwe kupedza?',
        'focus.listLabel': 'Runyorwa rwako',
        'focus.listPlaceholder': 'Wedzera danho rinotevera rinoita...',
        'focus.listTitle': 'Matanho madiki anokosha',
        'focus.live': 'Zviri kuitika',
        'focus.longBreak': 'Zororo refu',
        'focus.longReset': 'Kutangazve kurefu',
        'focus.notes': 'Zvinyorwa',
        'focus.pauseTimer': 'Mira timer',
        'focus.planPlaceholder': 'Chinhu chandinogona kuita chinotevera...',
        'focus.pomodoro': 'Pomodoro',
        'focus.quickPlan': 'Chirongwa chekukurumidza',
        'focus.ready': 'Yagadzirira paunenge wagadzirirawo',
        'focus.reset': 'Tangazve',
        'focus.resetMoment': 'Nguva yekutangazve',
        'focus.resume': 'Ramba netimer',
        'focus.shortBreak': 'Zororo diki',
        'focus.shortReset': 'Kutangazve kupfupi',
        'focus.soundLabel': 'Gadzira nzvimbo',
        'focus.soundscape': 'Ruzha rwenzvimbo',
        'focus.startTimer': 'Tanga timer',
        'focus.subtitle': 'Danho rinotevera rakajeka, nguva yakaganhurirwa, uye kudzikama kwakanaka.',
        'focus.title': 'Ita kuti focus inzwike zvinyoro.',
        'focus.volume': 'Kukwira kwenzwi',
        'focus.whiteNoise': 'Ruzha rwakachena',
        'focus.windowComplete': 'Nguva yapera',
        'focus.work': 'Basa',
        'friends.instagram': 'Instagram',
        'friends.phone': 'Runhare',
        'friends.whatsapp': 'WhatsApp',
        'grounding.complete': 'Wadzoka panguva ino yazvino.',
        'grounding.progress': '{done} kubva pa5 zvapera',
        'journal.quietCheckin': 'Check-in yakadzikama.',
        'language.label': 'Mutauro',
        'mood.chooseFit': 'Sarudza chinowirirana zvikuru',
        'mood.eyebrow': 'Mamiriro emwoyo',
        'mood.label': 'Isa mashoko mashoma (kwete kudikanwa)',
        'mood.optional': '(kwete kudikanwa)',
        'mood.placeholder': 'Chii chiri kuzadza pfungwa dzako?',
        'mood.prompt1': 'Ndezvipi zvinhu zvitatu zvaunotenda nezvazvo izvozvi?',
        'mood.prompt2': 'Chii chingaita kuti awa inotevera ive nyore ne1%?',
        'mood.prompt3': 'Chii chaunoda kunzwa nhasi?',
        'mood.promptsLabel': 'Mibvunzo inotungamira...',
        'mood.recentNotes': 'Zvinyorwa zvako zvichangobva kuitwa',
        'mood.save': 'Chengetedza check-in',
        'mood.subtitle': 'Check-in ihuchapupu, kwete mutongo.',
        'mood.title': 'Unonzwa sei mukati?',
        'overview.affirmationCount': 'Chikurudzira 1 ra5',
        'overview.taskCount': '{count} zvasara',
        'relief.breathIntro': 'Kufema kwebhokisi',
        'relief.breathText': 'Mativi mana akaenzana. Mwero unosimbisa.',
        'relief.breathTitle': '01 / Kufema',
        'relief.eyebrow': 'Gadzirisa uye udzoke',
        'relief.pause': 'Mira',
        'relief.progressLabel': '{done} kubva pa5 zvapera',
        'relief.ready': 'Yagadzirira',
        'relief.reset': 'Tangazve',
        'relief.senseText': 'Shandisa manzwiro ako kuti udzokere panguva ino yazvino.',
        'relief.senseTitle': 'Kudzoka 5-4-3-2-1',
        'relief.senses': '02 / Manzwiro',
        'relief.start': 'Tanga kufema',
        'relief.subtitle': 'Sarudza chiito chimwe chete. Unogona kumira chero nguva yaunoda.',
        'relief.title': 'Runyararo rushoma zvakawedzera.',
        'report.nextStep': 'Danho rinotevera riri nyoro: ita chinhu chidiki uye zvibvumire kuzorora.',
        'report.quietReflection': 'Kufungisisa kwakadzikama',
        'report.unavailable': 'Raibhurari yePDF haisi kuwanikwa mubrowser ino.',
        'share.quote': 'Govana mashoko',
        'task.delete': 'Bvisa basa',
      },
      moods: ['Akabudirira', 'Kugadzikana', 'Kufunganya', 'Kudzikira', 'Kukundikana'],
      grounding: [
        { sense: 'kuona', prompt: 'Seka zvinhu zvishanu zvaunoona.' },
        { sense: 'kubata', prompt: 'Cherechedza zvinhu zvina zvaunobata.' },
        { sense: 'kuteerera', prompt: 'Teerera zvinhu zvitatu zvaunonzwa.' },
        { sense: 'kunhuwidza', prompt: 'Tsvaga zviviri zvaunonhuwira.' },
        { sense: 'kuravira', prompt: 'Cherechedza chimwe chinhu chauri kuravira.' }
      ],
      affirmations: [
        'Unogona kutangazve zvinyoro.',
        'Zvidiki zvirikufamba zvakare.',
        'Unogona kusangana nenguva iyi kufema rimwe nerimwe.',
        'Kupumha chikamu chebasa.',
        'Attention yako yakanaka.'
        , 'Buda mazviri.'
      ],
      affirmationPrefix: 'Chikurudzira',
      affirmationConnector: 'ra',
      pageTitle: 'My mindscape'
    }
  };

  translations.tr = {
    ...translations.en,
    locale: 'tr-TR',
    title: 'My mindscape',
    text: {
      ...translations.en.text,
      'brand.tagline': 'daha yumuşak alanınız',
      'language.label': 'Dil',
      'auth.login': 'Giriş yap',
      'auth.loginTitle': 'My mindscape’e giriş yap',
      'auth.subtitle': 'İlerlemenizi güvenle saklayın.',
      'auth.submit': 'Giriş yap',
      'auth.create': 'Hesap oluştur',
      'auth.signupTitle': 'My mindscape hesabı oluştur',
      'auth.signupSubmit': 'Hesap oluştur',
      'auth.switchToLogin': 'Zaten hesabım var',
      'auth.email': 'E-posta',
      'auth.password': 'Şifre',
      'auth.firstName': 'Ad',
      'auth.lastName': 'Soyadı',
      'auth.reason': 'Buraya gelme nedeniniz nedir?',
      'auth.accountCreated': 'Hesap başarıyla oluşturuldu.',
      'auth.checkEmail': 'Hesap oluşturuldu. Giriş yapmadan önce onaylamak için e-postanızı kontrol edin.',
      'auth.error.exist': 'Bu e-posta zaten kullanılıyor. Giriş yapmayı deneyin.',
      'auth.signInRequired': 'Bu özelliği kullanmak için giriş yapın.',
      'share.quote': 'Sözü paylaş'
    },
    moods: ['Neşeli', 'Sakin', 'Endişeli', 'Kötü', 'Bunalmış'],
    affirmations: [
      'Yeniden ve nazikçe başlayabilirsin.',
      'Küçük adımlar da ilerlemedir.',
      'Bu anla tek bir nefesle buluşabilirsin.',
      'Dinlenmek yolculuğun bir parçasıdır.',
      'Dikkatin değerlidir.',
      'Bundan çık.'
    ],
    affirmationPrefix: 'Olumlama',
    affirmationConnector: '/',
    pageTitle: 'My mindscape'
  };

  const defaultState = { entries: [], tasks: [], friends: [], checkInDates: [], messages: {}, selectedMood: 'calm', selectedFriends: [] };
  let currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || 'null');
  let authMode = 'login';
  let emailCheckRequest = 0;
  let affirmationIndex = null;
  let state = { ...defaultState, ...readJSON(STORAGE_KEYS.state, {}) };
  state.selectedFriends = Array.isArray(state.selectedFriends) && state.selectedFriends.length
    ? state.selectedFriends
    : (state.selectedFriend ? [state.selectedFriend] : []);

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function persistState() {
    localStorage.setItem(STORAGE_KEYS.state, JSON.stringify(state));
    syncStateToSupabase();
  }

  async function syncStateToSupabase() {
    if (!supabaseClient || !currentUser?.id) return;
    const remoteState = {
      ...state,
      friends: state.friends.map(({ avatar, ...friend }) => ({ ...friend, avatar: '', avatarPath: friend.avatarPath || '' }))
    };
    const { error } = await supabaseClient.from('app_state').upsert({
      user_id: currentUser.id,
      state: remoteState,
      updated_at: new Date().toISOString()
    });
    if (error) console.error('Could not sync app state:', error.message);
  }

  async function loadStateFromSupabase() {
    if (!supabaseClient || !currentUser?.id) return;
    const { data, error } = await supabaseClient
      .from('app_state')
      .select('state')
      .eq('user_id', currentUser.id)
      .maybeSingle();
    if (error) {
      console.error('Could not load app state:', error.message);
      return;
    }
    if (data?.state) state = { ...defaultState, ...data.state };
    await hydrateFriendAvatars();
    renderApplication();
  }

  async function hydrateFriendAvatars() {
    if (!supabaseClient || !currentUser?.id) return;
    await Promise.all(state.friends.map(async (friend) => {
      if (!friend.avatarPath) return;
      const { data, error } = await supabaseClient.storage
        .from('friend-avatars')
        .createSignedUrl(friend.avatarPath, 60 * 60);
      if (!error && data?.signedUrl) friend.avatar = data.signedUrl;
    }));
  }

  function getLanguage() {
    const stored = localStorage.getItem(STORAGE_KEYS.language);
    return translations[stored] ? stored : 'pt';
  }

  function getTimeGreeting(languageKey = getLanguage(), date = new Date()) {
    const hour = date.getHours();
    const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    return timeGreetingTranslations[languageKey]?.[period] || timeGreetingTranslations.en[period];
  }

  function t(key, fallback = key) {
    const languageKey = getLanguage();
    const selected = translations[languageKey] || translations.en;
    const aliases = {
      'overview.streakTitle': 'streak.title',
      'overview.streakText': 'streak.subtitle',
      'overview.streakLabel': 'streak.label',
      'overview.streakDays': 'streak.label',
      'overview.reportTitle': 'report.title',
      'overview.reportText': 'report.note',
      'overview.reportButton': 'report.button',
      'friends.circleLabel': 'friend.circle',
      'friends.title': 'friends.title',
      'friends.namePlaceholder': 'friendName',
      'friends.contactPlaceholder': 'friendContact',
      'friends.addPhoto': 'friendAddPhoto',
      'friends.addFriend': 'friendAdd',
      'friends.removeSelected': 'friendRemove',
      'overview.taskPlaceholder': 'prompt.placeholder',
      'overview.taskAdd': 'prompt.add',
      'overview.taskCount': 'task.count'
    };
    const alias = aliases[key];
    return selected.text[key] || supplementalTranslations[languageKey]?.[key] || (alias && selected.text[alias]) || translations.pt.text[key] || translations.pt.text[alias] || translations.en.text[key] || translations.en.text[alias] || fallback;
  }

  function setLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.language, lang);
    const select = document.getElementById('language-select');
    if (select) select.value = lang;
    renderLanguageMenu();
    renderApplication();
  }

  function renderLanguageMenu() {
    const select = document.getElementById('language-select');
    const menu = document.getElementById('language-menu');
    const current = document.getElementById('language-current');
    if (!select || !menu || !current) return;

    const activeLanguage = getLanguage();
    const activeOption = Array.from(select.options).find((option) => option.value === activeLanguage);
    current.textContent = activeOption?.textContent || 'Português';
    menu.innerHTML = Array.from(select.options).map((option) => `
      <button class="language-option flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition hover:bg-mint/70 ${option.value === activeLanguage ? 'bg-mint text-sage' : 'text-slate-600'}" type="button" role="option" aria-selected="${option.value === activeLanguage}" data-language="${option.value}">
        <span>${escapeHtml(option.textContent)}</span>${option.value === activeLanguage ? '<span aria-hidden="true">✓</span>' : ''}
      </button>
    `).join('');

    menu.querySelectorAll('[data-language]').forEach((button) => {
      button.addEventListener('click', () => {
        setLanguage(button.dataset.language);
        menu.classList.add('hidden');
        document.getElementById('language-picker-button')?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function getCurrentPageName() {
    const activePanel = document.querySelector('.view-panel.active');
    return activePanel ? activePanel.id.replace('view-', '') : 'overview';
  }

  function renderApplication() {
    const language = translations[getLanguage()] || translations.en;
    document.documentElement.lang = language.locale;
    document.title = language.title;

    const pageMap = { overview: 0, mood: 1, relief: 2, focus: 3 };
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      const currentPage = getCurrentPageName();
      pageTitle.textContent = currentPage === 'overview'
        ? getTimeGreeting(getLanguage())
        : language.text[`page.${currentPage}`] || language.text['page.overview'];
    }

    const dateLabel = document.getElementById('date-label');
    if (dateLabel) {
      const today = new Date();
      dateLabel.textContent = language.weekdays && language.months
        ? `${language.weekdays[today.getDay()]}, ${language.months[today.getMonth()]} ${today.getDate()}`
        : new Intl.DateTimeFormat(language.locale, { weekday: 'long', month: 'long', day: 'numeric' }).format(today);
    }

    if (affirmationIndex === null) affirmationIndex = new Date().getDate() % language.affirmations.length;
    const affirmation = document.getElementById('affirmation');
    if (affirmation) affirmation.textContent = language.affirmations[affirmationIndex];

    const affirmationCount = document.getElementById('affirmation-count');
    if (affirmationCount) {
      affirmationCount.textContent = `${language.affirmationPrefix} ${affirmationIndex + 1} ${language.affirmationConnector} ${language.affirmations.length}`;
    }
    const shareButton = document.getElementById('share-affirmation');
    if (shareButton) shareButton.textContent = `↗ ${t('share.quote', 'Share quote')}`;

    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.dataset.i18n;
      const value = t(key, node.textContent || key);
      node.textContent = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const key = node.dataset.i18nPlaceholder;
      node.placeholder = t(key, node.getAttribute('placeholder') || key);
    });

    const placeholders = [
      ['#quick-task-input', 'overview.taskPlaceholder'],
      ['#friend-name', 'friends.namePlaceholder'],
      ['#friend-contact', 'friends.contactPlaceholder'],
      ['#journal-text', 'mood.placeholder'],
      ['#focus-plan', 'focus.planPlaceholder'],
      ['#auth-email', 'auth.emailPlaceholder'],
      ['#auth-password', 'auth.passwordPlaceholder'],
      ['#auth-first-name', 'auth.firstNamePlaceholder'],
      ['#auth-last-name', 'auth.lastNamePlaceholder'],
      ['#auth-reason', 'auth.reasonPlaceholder']
    ];
    placeholders.forEach(([selector, key]) => {
      const node = document.querySelector(selector);
      if (node) node.placeholder = t(key, node.getAttribute('placeholder') || key);
    });
    renderAuthReasonOptions();

    const languageLabel = document.querySelector('#language-picker > label');
    if (languageLabel) languageLabel.textContent = t('language.label', languageLabel.textContent);
    const breathInstruction = document.getElementById('breath-instruction');
    if (breathInstruction && !breathInterval) breathInstruction.textContent = t('breath.ready');
    const groundingProgress = document.getElementById('grounding-progress');
    if (groundingProgress) groundingProgress.textContent = t('grounding.progress').replace('{done}', String(document.querySelectorAll('.grounding-check:checked').length));
    const volumeLabel = document.querySelector('#volume-slider')?.previousElementSibling;
    if (volumeLabel) volumeLabel.textContent = t('focus.volume', volumeLabel.textContent);
    document.querySelector('[aria-label="Friends"]')?.setAttribute('aria-label', t('friends.title'));
    document.querySelector('[aria-label="Small to do list"]')?.setAttribute('aria-label', t('overview.taskTitle'));
    document.querySelector('#view-focus > div:last-child > article button')?.setAttribute('aria-label', t('focus.addTask'));
    const friendArticle = document.getElementById('friend-list')?.closest('article');
    const friendHeading = friendArticle?.querySelector('h2');
    const friendEyebrow = friendArticle?.querySelector('p');
    if (friendHeading) friendHeading.textContent = t('friends.title', friendHeading.textContent);
    if (friendEyebrow) friendEyebrow.textContent = t('friends.circleLabel', friendEyebrow.textContent);

    const staticNodes = [
      ['.desktop-sidebar > div:first-child p:last-child', 'brand.tagline'],
      ['.overview-placeholder', 'overview.pauseLabel']
    ];
    staticNodes.forEach(([selector, key]) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = t(key, node.textContent);
    });

    const textNodes = [
      ['#view-overview article:nth-of-type(1) p:first-of-type', 'overview.pauseLabel'],
      ['#view-overview article:nth-of-type(2) p:first-of-type', 'overview.rhythm'],
      ['#view-overview article:nth-of-type(2) span', 'overview.thisWeek'],
      ['#view-overview > div:nth-of-type(2) p', 'overview.makeRoom'],
      ['#view-overview > div:nth-of-type(2) h2', 'overview.needNow'],
      ['#view-overview .tool-card:nth-of-type(1) h3', 'overview.checkInTitle'],
      ['#view-overview .tool-card:nth-of-type(1) p', 'overview.checkInText'],
      ['#view-overview .tool-card:nth-of-type(1) span', 'overview.checkInAction'],
      ['#view-overview .tool-card:nth-of-type(2) h3', 'overview.calmTitle'],
      ['#view-overview .tool-card:nth-of-type(2) p', 'overview.calmText'],
      ['#view-overview .tool-card:nth-of-type(2) span', 'overview.calmAction'],
      ['#view-overview .tool-card:nth-of-type(3) h3', 'overview.focusTitle'],
      ['#view-overview .tool-card:nth-of-type(3) p', 'overview.focusText'],
      ['#view-overview .tool-card:nth-of-type(3) span', 'overview.focusAction'],
      ['#view-overview .tool-card:nth-of-type(4) h3', 'overview.smallThingTitle'],
      ['#view-overview .tool-card:nth-of-type(4) p', 'overview.smallThingText'],
      ['#view-overview .tool-card:nth-of-type(4) span', 'overview.smallThingAction'],
      ['#view-overview > div:nth-of-type(3) p:first-child', 'overview.noticeTitle'],
      ['#view-overview > div:nth-of-type(3) p:last-child', 'overview.noticeText'],
      ['#view-overview > div:nth-of-type(4) p:first-child', 'overview.streakTitle'],
      ['#view-overview > div:nth-of-type(4) p:nth-child(2)', 'overview.streakText'],
      ['#view-overview > div:nth-of-type(4) #checkin-streak-label', 'overview.streakLabel'],
      ['#view-overview section p:first-child', 'overview.taskLabel'],
      ['#view-overview section h2', 'overview.taskTitle'],
      ['#view-overview section button', 'overview.taskAdd'],
      ['#view-overview section + div p:first-child', 'overview.reportTitle'],
      ['#view-overview section + div p:nth-child(2)', 'overview.reportText'],
      ['#download-report', 'overview.reportButton'],
      ['#view-overview section[aria-label="Friends"] p', 'friends.circleLabel'],
      ['#view-overview section[aria-label="Friends"] h2', 'friends.title'],
      ['#friend-avatar-button', 'friends.addPhoto'],
      ['#add-friend', 'friends.addFriend'],
      ['#remove-friend', 'friends.removeSelected'],
      ['#view-mood > div:first-child p', 'mood.eyebrow'],
      ['#view-mood > div:first-child h2', 'mood.title'],
      ['#view-mood > div:first-child p:last-child', 'mood.subtitle'],
      ['#view-mood article:first-child h3', 'mood.chooseFit'],
      ['#view-mood article:first-child label', 'mood.label'],
      ['#journal-text', 'mood.placeholder'],
      ['#prompt-select option:first-child', 'mood.promptsLabel'],
      ['#save-journal', 'mood.save'],
      ['#view-mood article:last-child h3', 'mood.recentNotes'],
      ['#view-relief > div:first-child p', 'relief.eyebrow'],
      ['#view-relief > div:first-child h2', 'relief.title'],
      ['#view-relief > div:first-child p:last-child', 'relief.subtitle'],
      ['#view-relief article:first-child p', 'relief.breathTitle'],
      ['#view-relief article:first-child h3', 'relief.breathIntro'],
      ['#view-relief article:first-child p:last-of-type', 'relief.breathText'],
      ['#breath-start', 'relief.start'],
      ['#breath-stop', 'relief.pause'],
      ['#view-relief article:last-child > p', 'relief.senses'],
      ['#view-relief article:last-child h3', 'relief.senseTitle'],
      ['#view-relief article:last-child > p:nth-of-type(2)', 'relief.senseText'],
      ['#grounding-reset', 'relief.reset'],
      ['#view-focus > div:first-child p', 'focus.eyebrow'],
      ['#view-focus > div:first-child h2', 'focus.title'],
      ['#view-focus > div:first-child p:last-child', 'focus.subtitle'],
      ['#view-focus article:first-child > div:first-child p', 'focus.pomodoro'],
      ['#timer-mode', 'focus.deepFocus'],
      ['#view-focus .timer-mode:nth-child(1)', 'focus.work'],
      ['#view-focus .timer-mode:nth-child(2)', 'focus.shortBreak'],
      ['#view-focus .timer-mode:nth-child(3)', 'focus.longBreak'],
      ['#timer-toggle', 'focus.startTimer'],
      ['#timer-reset', 'focus.reset'],
      ['#view-focus .space-y-5 > article:nth-child(2) p:first-child', 'focus.soundscape'],
      ['#view-focus .space-y-5 > article:nth-child(2) h3', 'focus.soundLabel'],
      ['#audio-status', 'focus.live'],
      ['#view-focus > div:last-child > article p:first-child', 'focus.listLabel'],
      ['#view-focus > div:last-child > article h3', 'focus.listTitle'],
      ['#focus-clear', 'focus.clear'],
      ['label[for="auth-login-mode"]', 'auth.mode'],
      ['#auth-login-mode option:first-child', 'auth.signInOption'],
      ['#auth-login-mode option:last-child', 'auth.signUpOption'],
      ['#auth-first-name-wrap span', 'auth.firstName'],
      ['#auth-last-name-wrap span', 'auth.lastName'],
      ['#auth-reason-wrap span', 'auth.reason']
    ];
    textNodes.forEach(([selector, key]) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = t(key, node.textContent);
    });

    const promptOptions = document.querySelectorAll('#prompt-select option');
    ['mood.promptsLabel', 'mood.prompt1', 'mood.prompt2', 'mood.prompt3'].forEach((key, index) => {
      if (promptOptions[index]) promptOptions[index].textContent = t(key, promptOptions[index].textContent);
    });

    const breathingReady = document.getElementById('breath-round');
    if (breathingReady) breathingReady.textContent = t('relief.ready');
    const breathingTimer = document.getElementById('breath-timer');
    if (breathingTimer && !breathInterval) breathingTimer.textContent = `4 ${t('breath.seconds')}`;

    const focusText = [
      ['#view-focus article:nth-child(2) .sound-toggle', ['focus.whiteNoise', 'focus.gentleRain', 'focus.cafe']],
      ['#view-focus .space-y-5 > article:nth-child(2) .text-sm.font-semibold', ['focus.whiteNoise', 'focus.gentleRain', 'focus.cafe']],
      ['#view-focus > div:last-child > article button', ['focus.addTask']],
      ['#view-focus > div:last-child > article p:last-child', ['focus.listEmpty']]
    ];
    focusText.forEach(([selector, keys]) => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((node, index) => {
        const key = keys[index] || keys[0];
        node.textContent = t(key, node.textContent);
      });
    });
    const focusInput = document.querySelector('#view-focus > div:last-child > article input');
    if (focusInput) focusInput.placeholder = t('focus.listPlaceholder', focusInput.placeholder);

    const streakCard = document.getElementById('checkin-streak')?.parentElement?.parentElement;
    if (streakCard) {
      const labels = streakCard.querySelectorAll('p');
      if (labels[0]) labels[0].textContent = t('overview.streakTitle');
      if (labels[1]) labels[1].textContent = t('overview.streakText');
    }

    const contactTypes = document.getElementById('friend-contact-type')?.options;
    if (contactTypes) {
      const labels = [t('friends.whatsapp'), t('friends.instagram'), t('friends.phone')];
      Array.from(contactTypes).forEach((option, index) => { option.textContent = labels[index] || option.textContent; });
    }

    const weekdayRow = document.querySelector('#view-overview article:nth-of-type(2) > div:last-child');
    if (weekdayRow) {
      const monday = new Date();
      const day = monday.getDay();
      monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day));
      weekdayRow.innerHTML = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        const dayLabel = language.weekdaysShort
          ? language.weekdaysShort[date.getDay()]
          : new Intl.DateTimeFormat(language.locale, { weekday: 'short' }).format(date);
        return `<span>${dayLabel}</span>`;
      }).join('');
    }

    const resetButton = document.getElementById('reset-session');
    if (resetButton) resetButton.textContent = t('auth.clear', 'Clear data');

    renderMoodOptions();
    renderHistory();
    renderGrounding();
    renderTasks();
    renderQuickTasks();
    renderFriends();
    renderStreak();
    updateAuthButton();
  }

  function renderMoodOptions() {
    const container = document.getElementById('mood-options');
    if (!container) return;
    const labels = translations[getLanguage()]?.moods || translations.en.moods;
    container.innerHTML = moodMeta.map((mood, index) => `
      <button data-mood="${mood.key}" class="mood-choice flex flex-col items-center gap-2 rounded-2xl border-2 ${state.selectedMood === mood.key ? 'border-sage bg-mint/60' : 'border-transparent bg-slate-50'} p-3 transition-all duration-300 hover:-translate-y-1" type="button">
        <span class="grid h-10 w-10 place-items-center rounded-full ${mood.color} text-xl">${mood.icon}</span>
        <span class="text-[11px] font-bold text-slate-600">${labels[index]}</span>
      </button>
    `).join('');

    container.querySelectorAll('.mood-choice').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedMood = button.dataset.mood;
        persistState();
        renderMoodOptions();
      });
    });
  }

  function renderHistory() {
    const history = document.getElementById('journal-history');
    const countLabel = document.getElementById('entry-count');
    if (!history) return;

    const entryCount = state.entries.length;
    const verb = entryCount === 1 ? t('journal.entry') : t('journal.entries');
    if (countLabel) countLabel.textContent = `${entryCount} ${verb}`;

    if (!entryCount) {
      history.innerHTML = `<div class="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-400">${t('journal.empty')}</div>`;
      return;
    }

    history.innerHTML = state.entries.map((entry) => {
      const mood = moodMeta.find((item) => item.key === entry.mood) || moodMeta[1];
      const moodIndex = moodMeta.findIndex((item) => item.key === entry.mood);
      const moodLabel = (translations[getLanguage()]?.moods || translations.en.moods)[moodIndex >= 0 ? moodIndex : 1];
      return `
        <div class="rounded-2xl border border-slate-100 bg-white p-4">
          <div class="mb-2 flex items-center justify-between">
            <span class="rounded-full ${mood.color} px-2.5 py-1 text-[10px] font-bold">${mood.icon} ${moodLabel}</span>
            <span class="text-[11px] font-semibold text-slate-400">${escapeHtml(entry.date)}</span>
          </div>
          <p class="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">${escapeHtml(entry.text || t('journal.quietCheckin', 'Quiet check-in.'))}</p>
        </div>
      `;
    }).join('');
  }

  function renderGrounding() {
    const list = document.getElementById('grounding-list');
    if (!list) return;
    const items = translations[getLanguage()]?.grounding || translations.en.grounding;
    list.innerHTML = items.map((step, index) => `
      <label class="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-100 bg-white p-3 transition hover:border-indigo-200">
        <input data-grounding="${index}" class="grounding-check h-5 w-5 accent-sage" type="checkbox">
        <span class="grid h-9 w-9 place-items-center rounded-xl bg-lavender font-display text-lg text-indigo-700">${index === 0 ? 5 : index === 1 ? 4 : index === 2 ? 3 : index === 3 ? 2 : 1}</span>
        <span>
          <strong class="block text-sm text-slate-700">${step.sense}</strong>
          <span class="text-xs text-slate-400">${step.prompt}</span>
        </span>
      </label>
    `).join('');

    list.querySelectorAll('.grounding-check').forEach((input) => {
      input.addEventListener('change', updateGroundingProgress);
    });
    updateGroundingProgress();
  }

  function updateGroundingProgress() {
    const progress = document.getElementById('grounding-progress');
    if (!progress) return;
    const done = document.querySelectorAll('.grounding-check:checked').length;
    progress.textContent = t('grounding.progress').replace('{done}', String(done));
    if (done === 5) showToast(t('grounding.complete'));
  }

  function renderTasks() {
    normalizeTaskContainers();
    const lists = document.querySelectorAll('#overview-task-list, #task-list');
    if (!lists.length) return;
    const remaining = state.tasks.filter((task) => !task.done).length;
    const countTag = document.getElementById('task-count');
    if (countTag) countTag.textContent = t('overview.taskCount', '{count} left').replace('{count}', String(remaining));

    if (!state.tasks.length) {
      lists.forEach((list) => { list.innerHTML = `<p class="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">${t('task.empty')}</p>`; });
      return;
    }

    const taskMarkup = state.tasks.map((task, index) => `
      <div class="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
        <input data-task-index="${index}" class="task-check h-5 w-5 accent-sage" type="checkbox" ${task.done ? 'checked' : ''}>
        <span class="min-w-0 flex-1 break-words text-sm ${task.done ? 'text-slate-400 line-through' : 'font-semibold text-slate-700'}">${escapeHtml(task.text)}</span>
        <button data-delete-task="${index}" class="px-2 text-lg text-slate-300 transition hover:text-rose-400" type="button" aria-label="${t('task.delete', 'Delete task')}">×</button>
      </div>
    `).join('');
    lists.forEach((list) => { list.innerHTML = taskMarkup; });

    lists.forEach((list) => list.querySelectorAll('.task-check').forEach((check) => {
      check.addEventListener('change', () => {
        const index = Number(check.dataset.taskIndex);
        state.tasks[index].done = check.checked;
        persistState();
        renderTasks();
        renderQuickTasks();
      });
    }));

    lists.forEach((list) => list.querySelectorAll('[data-delete-task]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.deleteTask);
        state.tasks.splice(index, 1);
        persistState();
        renderTasks();
        renderQuickTasks();
      });
    }));
  }

  function normalizeTaskContainers() {
    const containers = document.querySelectorAll('[id="task-list"]');
    if (containers.length > 1 && !document.getElementById('overview-task-list')) containers[0].id = 'overview-task-list';
  }

  function renderQuickTasks() {
    const list = document.getElementById('quick-task-list');
    if (!list) return;
    const remaining = state.tasks.filter((task) => !task.done).length;
    const countTag = document.getElementById('quick-task-count');
    if (countTag) countTag.textContent = t('overview.taskCount', '{count} left').replace('{count}', String(remaining));

    const visibleTasks = state.tasks.filter((task) => !task.done).slice(0, 3);
    if (!visibleTasks.length) {
      list.innerHTML = `<p class="rounded-xl bg-mint/50 p-4 text-center text-sm text-slate-500">${t('quick.empty')}</p>`;
      return;
    }

    list.innerHTML = visibleTasks.map((task, index) => {
      const realIndex = state.tasks.findIndex((item) => item === task);
      return `
        <label class="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
          <input data-quick-task-index="${realIndex}" class="quick-task-check h-4 w-4 accent-sage" type="checkbox">
          <span class="min-w-0 flex-1 break-words">${escapeHtml(task.text)}</span>
        </label>
      `;
    }).join('');

    list.querySelectorAll('.quick-task-check').forEach((check) => {
      check.addEventListener('change', () => {
        const index = Number(check.dataset.quickTaskIndex);
        if (Number.isInteger(index) && state.tasks[index]) {
          state.tasks[index].done = true;
          persistState();
          renderTasks();
          renderQuickTasks();
        }
      });
    });
  }

  function getFriendContactUrl(friend) {
    const contact = String(friend.contact || '').trim();
    if (!contact) return '';
    if (friend.contactType === 'WhatsApp') {
      const phone = contact.replace(/[^\d]/g, '');
      return phone ? `https://wa.me/${phone}` : '';
    }
    if (friend.contactType === 'Instagram') {
      if (/^https?:\/\//i.test(contact)) return contact;
      return `https://www.instagram.com/${encodeURIComponent(contact.replace(/^@/, ''))}`;
    }
    return `tel:${contact.replace(/[^\d+*#;,]/g, '')}`;
  }

  function renderFriends() {
    const list = document.getElementById('friend-list');
    if (!list) return;
    const emptyText = t('friends.empty');
    if (!state.friends.length) {
      list.innerHTML = `<p class="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-400">${emptyText}</p>`;
      return;
    }

    list.innerHTML = state.friends.map((friend) => {
      const contactUrl = getFriendContactUrl(friend);
      return `
      <div data-friend-id="${escapeHtml(friend.id)}" class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${state.selectedFriends.includes(friend.id) ? 'bg-mint text-sage' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}" role="button" tabindex="0">
        <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lavender text-indigo-700 ${friend.avatar ? 'overflow-hidden' : ''}">
          ${friend.avatar ? `<img src="${friend.avatar}" alt="" class="h-full w-full rounded-full object-cover">` : escapeHtml(friend.name.charAt(0).toUpperCase())}
        </span>
        <span class="min-w-0 flex-1 truncate">
          <strong class="block truncate">${escapeHtml(friend.name)}</strong>
          ${contactUrl ? `<a data-friend-contact href="${escapeHtml(contactUrl)}" target="_blank" rel="noopener noreferrer" class="block truncate text-[10px] font-normal text-sage underline-offset-2 hover:underline">${escapeHtml(`${friend.contactType}: ${friend.contact}`)}</a>` : ''}
        </span>
      </div>
    `;
    }).join('');

    list.querySelectorAll('[data-friend-id]').forEach((card) => {
      const selectFriend = () => {
        const friendId = card.dataset.friendId;
        state.selectedFriends = state.selectedFriends.includes(friendId)
          ? state.selectedFriends.filter((id) => id !== friendId)
          : [...state.selectedFriends, friendId];
        persistState();
        renderFriends();
        updateRemoveButton();
      };
      card.addEventListener('click', selectFriend);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectFriend();
        }
      });
    });
    list.querySelectorAll('[data-friend-contact]').forEach((link) => {
      link.addEventListener('click', (event) => event.stopPropagation());
    });

    updateRemoveButton();
  }

  function updateRemoveButton() {
    const button = document.getElementById('remove-friend');
    if (button) button.disabled = !state.selectedFriends.length;
  }

  function updateContactInput() {
    const type = document.getElementById('friend-contact-type')?.value;
    const input = document.getElementById('friend-contact');
    if (!input) return;
    const placeholders = {
      WhatsApp: 'Phone number with country code',
      Instagram: 'Instagram username or link',
      Phone: 'Phone number'
    };
    input.placeholder = placeholders[type] || 'Contact detail';
  }

  function renderStreak() {
    const streak = document.getElementById('checkin-streak');
    const label = document.getElementById('checkin-streak-label');
    if (!streak) return;
    const count = getCurrentStreak();
    streak.textContent = String(count);
    if (label) label.textContent = t('overview.streakDays', t('streak.label', 'days'));
  }

  function getCurrentStreak() {
    const dates = new Set(state.checkInDates);
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    while (dates.has(getLocalDateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addTask(text, source = 'main') {
    const cleanText = text.trim();
    if (!cleanText) return;
    state.tasks.push({ text: cleanText, done: false });
    persistState();
    renderTasks();
    renderQuickTasks();
    const field = source === 'quick' ? document.getElementById('quick-task-input') : document.getElementById('task-input');
    if (field) field.value = '';
    showToast(t('task.saved'));
  }

  function saveJournal() {
    const input = document.getElementById('journal-text');
    if (!input) return;
    const text = input.value.trim();
    const todayKey = getLocalDateKey();
    state.entries.unshift({
      mood: state.selectedMood,
      text,
      date: new Date().toLocaleDateString()
    });
    state.entries = state.entries.slice(0, 20);
    if (!state.checkInDates.includes(todayKey)) state.checkInDates.push(todayKey);
    persistState();
    renderHistory();
    renderStreak();
    input.value = '';
    showToast(t('journal.saved'));
  }

  async function saveFriend() {
    const input = document.getElementById('friend-name');
    const contact = document.getElementById('friend-contact');
    if (!input || !contact) return;

    const name = input.value.trim();
    const contactValue = contact.value.trim();
    if (!name || !contactValue) {
      showToast(t('friendAddPrompt'));
      return;
    }

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    let avatarPath = '';
    if (pendingAvatar && supabaseClient && currentUser?.id) {
      const match = pendingAvatar.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
      if (match) {
        const extension = match[1].split('/')[1].replace('jpeg', 'jpg').replace(/[^a-z0-9]/gi, '');
        const binary = atob(match[2]);
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
        avatarPath = `${currentUser.id}/${id}.${extension}`;
        const { error } = await supabaseClient.storage.from('friend-avatars').upload(avatarPath, new Blob([bytes], { type: match[1] }), { upsert: false, contentType: match[1] });
        if (error) {
          showToast(t('auth.error.general'));
          return;
        }
      }
    }
    state.friends.push({
      id,
      name,
      contactType: document.getElementById('friend-contact-type')?.value || 'WhatsApp',
      contact: contactValue,
      avatar: pendingAvatar || '',
      avatarPath
    });
    state.selectedFriends = [...state.selectedFriends, id];
    state.messages[id] = [];
    persistState();
    renderFriends();
    input.value = '';
    contact.value = '';
    pendingAvatar = '';
    updateRemoveButton();
    showToast(t('friendAdded', `${name} added to your circle.`).replace('{name}', name));
  }

  function removeSelectedFriend() {
    if (!state.selectedFriends.length) return;
    const selectedIds = new Set(state.selectedFriends);
    const removedCount = state.friends.filter((friend) => selectedIds.has(friend.id)).length;
    state.friends = state.friends.filter((friend) => !selectedIds.has(friend.id));
    selectedIds.forEach((id) => delete state.messages[id]);
    state.selectedFriends = [];
    persistState();
    renderFriends();
    updateRemoveButton();
    showToast(`${removedCount} ${t('friends.title', 'friends')} removed.`);
  }

  function downloadReport() {
    const { jsPDF } = window.jspdf || {};
    const languageKey = getLanguage();
    const language = translations[languageKey] || translations.en;
    const labels = reportTranslations[languageKey] || reportTranslations.pt;
    if (!jsPDF) {
      showToast(t('report.unavailable', 'PDF library is unavailable in this browser.'));
      return;
    }

    const doc = new jsPDF();
    let y = 15;
    const addText = (text, size = 11, color = [45, 55, 72]) => {
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(String(text), 180);
      lines.forEach((line) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 14, y);
        y += size * 0.6 + 3;
      });
    };

    doc.setFillColor(84, 115, 94);
    doc.rect(0, 0, 210, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(`${language.title || 'My mindscape'} - ${labels.header}`, 14, 11);

    y = 25;
    addText(`${labels.generated}: ${new Date().toLocaleDateString(language.locale)}`);
    addText(`${labels.checkins}: ${state.entries.length}`);
    addText(`${labels.tasks}: ${state.tasks.filter((task) => task.done).length}/${state.tasks.length}`);
    addText(`${labels.friends}: ${state.friends.length}`);
    addText(`${labels.moodSummary}:`, 14, [84, 115, 94]);
    const summary = moodMeta.map((mood) => {
      const count = state.entries.filter((entry) => entry.mood === mood.key).length;
      const moodIndex = moodMeta.findIndex((item) => item.key === mood.key);
      const moodLabel = language.moods?.[moodIndex] || mood.label;
      return `${moodLabel}: ${count}`;
    }).join(' | ');
    addText(summary);

    if (state.entries.length) {
      addText(`${labels.recent}:`, 14, [84, 115, 94]);
      state.entries.slice(0, 6).forEach((entry) => {
        const moodIndex = moodMeta.findIndex((item) => item.key === entry.mood);
        const moodLabel = language.moods?.[moodIndex] || entry.mood;
        addText(`${entry.date} • ${moodLabel}: ${entry.text || labels.quiet}`);
      });
    }

    addText(labels.next, 11, [100, 116, 139]);
    doc.save('stillpoint-report.pdf');
    showToast(t('report.downloaded'));
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function switchView(view) {
    document.querySelectorAll('.view-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === `view-${view}`);
    });
    document.querySelectorAll('.nav-button').forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle('nav-active', active);
      button.classList.toggle('text-slate-400', !active);
      button.classList.toggle('text-slate-500', !active && button.closest('.desktop-sidebar'));
    });
    const pageTitle = document.getElementById('page-title');
    const language = translations[getLanguage()] || translations.en;
    const key = `page.${view}`;
    if (pageTitle) pageTitle.textContent = view === 'overview'
      ? getTimeGreeting(getLanguage())
      : language.text[key] || language.text['page.overview'];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  let pendingAvatar = '';
  function bindFileInput() {
    const input = document.getElementById('friend-avatar');
    const button = document.getElementById('friend-avatar-button');
    if (input && button) {
      input.style.display = 'none';
      input.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          pendingAvatar = String(reader.result);
        };
        reader.readAsDataURL(file);
      });
      button.addEventListener('click', () => input.click());
    }
  }

  function openAuth() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    authMode = 'login';
    resetAuthForm();
    refreshAuthModeText();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function closeAuth() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  async function clearLocalData() {
    if (supabaseClient) await supabaseClient.auth.signOut();
    localStorage.removeItem(STORAGE_KEYS.state);
    localStorage.removeItem(STORAGE_KEYS.session);
    localStorage.removeItem(STORAGE_KEYS.accounts);
    currentUser = null;
    state = { ...defaultState };
    renderApplication();
    updateAuthButton();
    showToast(t('auth.dataCleared'));
  }

  async function signOutOnly() {
    if (supabaseClient) await supabaseClient.auth.signOut();
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.session);
    updateAuthButton();
    showToast(t('auth.signedOut'));
  }

  function openLogoutChoice() {
    if (document.getElementById('logout-choice')) return;
    const overlay = document.createElement('div');
    overlay.id = 'logout-choice';
    overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-5 backdrop-blur-sm';
    overlay.innerHTML = `
      <div class="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/95 p-7 shadow-float backdrop-blur-xl">
        <div class="mb-6"><p class="mb-2 text-xs font-bold uppercase tracking-[.18em] text-sage">${escapeHtml(t('auth.eyebrow'))}</p><h2 class="font-display text-3xl text-slate-800">${escapeHtml(t('auth.logoutTitle'))}</h2><p class="mt-2 text-sm leading-relaxed text-slate-500">${escapeHtml(t('auth.logoutDescription'))}</p></div>
        <div class="grid gap-3"><button data-logout-action="keep" type="button" class="rounded-xl bg-sage px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">${escapeHtml(t('auth.logoutOnly'))}</button><button data-logout-action="clear" type="button" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100">${escapeHtml(t('auth.logoutAndClear'))}</button><button data-logout-action="cancel" type="button" class="rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100">${escapeHtml(t('auth.cancel'))}</button></div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('[data-logout-action="keep"]')?.addEventListener('click', async () => {
      await signOutOnly();
      overlay.remove();
    });
    overlay.querySelector('[data-logout-action="clear"]')?.addEventListener('click', async () => {
      await signOutOnly();
      clearLocalData();
      overlay.remove();
    });
    overlay.querySelector('[data-logout-action="cancel"]')?.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) overlay.remove();
    });
  }

  function refreshAuthModeText() {
    const mode = authMode;
    const title = document.getElementById('auth-title');
    const submit = document.getElementById('auth-submit');
    const switchButton = document.getElementById('auth-switch');
    const firstNameWrap = document.getElementById('auth-first-name-wrap');
    const lastNameWrap = document.getElementById('auth-last-name-wrap');
    const reasonWrap = document.getElementById('auth-reason-wrap');

    if (firstNameWrap) firstNameWrap.classList.toggle('hidden', mode === 'login');
    if (lastNameWrap) lastNameWrap.classList.toggle('hidden', mode === 'login');
    if (reasonWrap) reasonWrap.classList.toggle('hidden', mode === 'login');
    if (title) title.textContent = mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle');
    if (submit) submit.textContent = mode === 'login' ? t('auth.submit') : t('auth.signupSubmit');
    if (switchButton) switchButton.textContent = mode === 'login' ? t('auth.create') : t('auth.switchToLogin');
    const emailStatus = document.getElementById('auth-email-status');
    if (emailStatus && mode === 'login') emailStatus.textContent = '';
  }

  function resetAuthForm() {
    const form = document.getElementById('auth-form');
    form?.reset();
    form?.querySelectorAll('input, textarea, select').forEach((field) => {
      if (field.id !== 'auth-login-mode') field.value = '';
    });
    const email = document.getElementById('auth-email');
    const password = document.getElementById('auth-password');
    if (email) email.setAttribute('autocomplete', 'off');
    if (password) password.setAttribute('autocomplete', 'new-password');
    const emailStatus = document.getElementById('auth-email-status');
    if (emailStatus) emailStatus.textContent = '';
  }

  function bindEmailAvailability() {
    const input = document.getElementById('auth-email');
    if (!input) return;
    const status = document.createElement('p');
    status.id = 'auth-email-status';
    status.className = 'mt-1 text-xs font-semibold text-rose-600';
    input.closest('label')?.append(status);
    let timer = null;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      status.textContent = '';
      if (authMode !== 'signup' || !supabaseClient || !input.validity.valid) return;
      const email = input.value.trim().toLowerCase();
      timer = setTimeout(async () => {
        const request = ++emailCheckRequest;
        const { data, error } = await supabaseClient.rpc('email_is_taken', { email_to_check: email });
        if (request !== emailCheckRequest || error) return;
        if (data === true && authMode === 'signup') status.textContent = t('auth.error.exist');
      }, 400);
    });
  }

  function renderAuthReasonOptions() {
    const field = document.getElementById('auth-reason');
    if (!field) return;
    const options = authReasonOptions[getLanguage()] || authReasonOptions.pt;
    const currentValue = field.value;
    if (field.tagName !== 'SELECT') {
      const select = document.createElement('select');
      select.id = 'auth-reason';
      select.className = field.className.replace('resize-none', '');
      select.required = false;
      field.replaceWith(select);
    }
    const select = document.getElementById('auth-reason');
    if (!select) return;
    select.innerHTML = `<option value="">${escapeHtml(t('auth.reasonChoose', 'Choose what would help most...'))}</option>${options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join('')}`;
    select.value = options.includes(currentValue) ? currentValue : '';
  }

  function updateAuthButton() {
    const button = document.getElementById('login-button');
    if (!button) return;
    const signout = document.getElementById('signout-button');
    if (currentUser?.email) {
      button.textContent = currentUser.email;
      button.classList.add('bg-slate-700');
      if (signout) {
        signout.classList.remove('hidden');
        signout.textContent = t('auth.signout');
      }
    } else {
      button.textContent = t('auth.login');
      button.classList.remove('bg-slate-700');
      if (signout) signout.classList.add('hidden');
    }
  }

  function createSignoutButtonIfNeeded() {
    if (document.getElementById('signout-button')) return;
    const button = document.createElement('button');
    button.id = 'signout-button';
    button.type = 'button';
    button.className = 'hidden rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-bold text-slate-500 transition hover:border-rose-300 hover:text-rose-600';
    button.textContent = t('auth.signout');
    document.getElementById('login-button')?.after(button);
    button.addEventListener('click', () => {
      openLogoutChoice();
    });
  }

  async function handleSaveAccount(event) {
    event.preventDefault();
    const email = document.getElementById('auth-email').value.trim().toLowerCase();
    const password = document.getElementById('auth-password').value;
    const firstName = document.getElementById('auth-first-name')?.value.trim() || '';
    const lastName = document.getElementById('auth-last-name')?.value.trim() || '';
    const reason = document.getElementById('auth-reason')?.value || '';
    const mode = authMode;

    if (!email || !password || (mode === 'signup' && !firstName && !lastName)) {
      showToast(mode === 'signup' ? t('auth.completeForm') : t('auth.enterDetails'));
      return;
    }

    if (!supabaseClient) {
      showToast(t('auth.error.general'));
      return;
    }

    let result = mode === 'login'
      ? await supabaseClient.auth.signInWithPassword({ email, password })
      : await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName, onboarding_reason: reason } }
      });
    if (result.error) {
      const duplicateEmail = mode === 'signup'
        && (result.error.status === 422 || /already|registered|exists/i.test(result.error.message || ''));
      showToast(mode === 'login' ? t('auth.error.invalid') : (duplicateEmail ? t('auth.error.exist') : t('auth.error.general')));
      return;
    }

    if (mode === 'signup' && !result.data.session) {
      result = await supabaseClient.auth.signInWithPassword({ email, password });
      if (result.error) {
        showToast(/confirm|verif/i.test(result.error.message || '') ? t('auth.checkEmail') : t('auth.error.general'));
        return;
      }
    }

    const user = result.data.user;
    if (!user) {
      showToast(t('auth.error.general'));
      return;
    }
    if (mode === 'signup' && result.data.session) {
      const { error: profileError } = await supabaseClient.from('profiles').upsert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        onboarding_reason: reason,
        display_name: [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0]
      });
      if (profileError) {
        showToast(t('auth.error.general'));
        return;
      }
    }

    if (result.data.session) {
      currentUser = { id: user.id, email: user.email, firstName, lastName, reason };
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(currentUser));
      updateAuthButton();
      closeAuth();
    }
    showToast(mode === 'login'
      ? t('auth.welcomeBack')
      : (result.data.session ? t('auth.accountCreated') : t('auth.checkEmail')));
  }

  function bindAuth() {
    const modal = document.getElementById('auth-modal');
    const loginButton = document.getElementById('login-button');
    const switchButton = document.getElementById('auth-switch');
    const closeButton = document.getElementById('auth-close');
    const form = document.getElementById('auth-form');
    document.getElementById('auth-login-mode')?.closest('.block')?.remove();
    document.querySelector('[data-i18n="auth.supabaseTitle"]')?.closest('div')?.remove();
    bindPasswordToggle();
    setBrainLogo();
    bindEmailAvailability();

    if (loginButton) {
      loginButton.addEventListener('click', () => {
        if (currentUser?.email) {
          openLogoutChoice();
          return;
        }
        openAuth();
      });
    }

    if (switchButton) {
      switchButton.addEventListener('click', () => {
        authMode = authMode === 'login' ? 'signup' : 'login';
        resetAuthForm();
        refreshAuthModeText();
      });
    }

    if (closeButton) closeButton.addEventListener('click', closeAuth);
    if (form) form.addEventListener('submit', handleSaveAccount);
    refreshAuthModeText();

    if (modal) modal.addEventListener('click', (event) => {
      if (event.target === modal) closeAuth();
    });
  }

  function bindAuthGate() {
    const isAllowedWhenSignedOut = (target) => target.closest('#language-picker, #login-button, #auth-modal');
    document.addEventListener('click', (event) => {
      if (currentUser?.email || isAllowedWhenSignedOut(event.target)) return;
      if (!event.target.closest('main, .desktop-sidebar, .mobile-tabbar, #reset-session, #signout-button')) return;
      event.preventDefault();
      event.stopPropagation();
      showToast(t('auth.signInRequired'));
      openAuth();
    }, true);
  }

  function bindAffirmationSwitcher() {
    const card = document.getElementById('affirmation')?.closest('article');
    if (!card || card.dataset.affirmationBound) return;
    card.dataset.affirmationBound = 'true';
    card.classList.add('cursor-pointer');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    const shareButton = document.createElement('button');
    shareButton.id = 'share-affirmation';
    shareButton.type = 'button';
    shareButton.className = 'shrink-0 rounded-full bg-white/15 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/60';
    shareButton.textContent = `↗ ${t('share.quote', 'Share quote')}`;
    const metaRow = card.querySelector('#affirmation-meta');
    (metaRow || card).appendChild(shareButton);
    shareButton.addEventListener('click', shareAffirmation);
    const nextAffirmation = () => {
      const language = translations[getLanguage()] || translations.en;
      affirmationIndex = (affirmationIndex + 1) % language.affirmations.length;
      renderApplication();
    };
    card.addEventListener('click', nextAffirmation);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        nextAffirmation();
      }
    });
  }

  async function shareAffirmation(event) {
    event.stopPropagation();
    const language = translations[getLanguage()] || translations.en;
    const quote = language.affirmations[affirmationIndex];
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const context = canvas.getContext('2d');
    context.fillStyle = '#54735e';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(255,255,255,.12)';
    context.beginPath();
    context.arc(1020, 90, 180, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#dfeee2';
    context.font = '600 28px DM Sans, sans-serif';
    context.fillText('MY MINDSCAPE', 80, 90);
    context.fillStyle = '#ffffff';
    context.font = '600 54px Fraunces, Georgia, serif';
    const words = quote.split(' ');
    const lines = [];
    let line = '';
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width > 980 && line) {
        lines.push(line);
        line = word;
      } else line = candidate;
    });
    if (line) lines.push(line);
    lines.forEach((text, index) => context.fillText(text, 80, 275 + index * 72));
    context.fillStyle = '#dfeee2';
    context.font = '500 24px DM Sans, sans-serif';
    context.fillText('A softer space for your mind', 80, 540);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return;
    const file = new File([blob], 'my-mindscape-quote.png', { type: 'image/png' });
    const appUrl = 'https://mymindescape.vercel.app';
    const shareText = `${quote}\n\n${appUrl}`;
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      await navigator.share({ files: [file], title: 'My mindscape', text: shareText }).catch(() => {});
      return;
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(t('share.quote', 'Quote image downloaded.'));
  }

  function bindPasswordToggle() {
    const input = document.getElementById('auth-password');
    if (!input || document.getElementById('auth-password-toggle')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'relative';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    input.classList.add('pr-12');
    const button = document.createElement('button');
    button.id = 'auth-password-toggle';
    button.type = 'button';
    button.className = 'absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-sage focus:outline-none focus:ring-2 focus:ring-emerald-100';
    button.setAttribute('aria-label', 'Show password');
    button.innerHTML = '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path><circle cx="12" cy="12" r="2.5"></circle></svg>';
    wrapper.appendChild(button);
    button.addEventListener('click', () => {
      const visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      button.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    });
  }

  function setBrainLogo() {
    const logo = document.querySelector('.desktop-sidebar > div:first-child > div:first-child > span');
    if (!logo) return;
    const tile = logo.parentElement;
    tile?.classList.remove('bg-sage', 'text-white');
    tile?.classList.add('bg-mint', 'text-sage');
    logo.innerHTML = '<svg class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-label="Brain"><path d="M10.8 3.3A4.2 4.2 0 0 0 6 6.9a3.8 3.8 0 0 0-2.5 3.6c0 1.2.5 2.3 1.3 3.1A3.9 3.9 0 0 0 8.5 18a4.1 4.1 0 0 0 3.5 2.1V3.8c-.4-.2-.8-.4-1.2-.5Z"></path><path d="M13.2 3.3A4.2 4.2 0 0 1 18 6.9a3.8 3.8 0 0 1 2.5 3.6c0 1.2-.5 2.3-1.3 3.1a3.9 3.9 0 0 1-3.7 4.4 4.1 4.1 0 0 1-3.5 2.1V3.8c.4-.2.8-.4 1.2-.5Z"></path><path d="M9 7.5h2v1H9zM13 7.5h2v1h-2zM8 11h3v1H8zM13 11h3v1h-3zM9 14.5h2v1H9zM13 14.5h2v1h-2z" fill="#dfeee2"></path></svg>';
  }

  async function init() {
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      if (!languageSelect.querySelector('option[value="tr"]')) languageSelect.add(new Option('Türkçe', 'tr'));
      languageSelect.value = getLanguage();
      languageSelect.addEventListener('change', (event) => setLanguage(event.target.value));
    }

    renderLanguageMenu();
    const languageButton = document.getElementById('language-picker-button');
    const languageMenu = document.getElementById('language-menu');
    const languagePicker = document.getElementById('language-picker');
    languageButton?.addEventListener('click', () => {
      const isOpen = !languageMenu?.classList.contains('hidden');
      languageMenu?.classList.toggle('hidden', isOpen);
      languageButton.setAttribute('aria-expanded', String(!isOpen));
    });
    document.addEventListener('click', (event) => {
      if (languagePicker && !languagePicker.contains(event.target)) {
        languageMenu?.classList.add('hidden');
        languageButton?.setAttribute('aria-expanded', 'false');
      }
    });

    document.querySelectorAll('[data-view]').forEach((button) => {
      button.addEventListener('click', () => {
        const nextView = button.dataset.view;
        if (nextView) switchView(nextView);
      });
    });

    document.getElementById('save-journal')?.addEventListener('click', saveJournal);
    document.getElementById('prompt-select')?.addEventListener('change', (event) => {
      const value = event.target.value;
      if (value) {
        const journal = document.getElementById('journal-text');
        if (journal) journal.value = `${value}\n\n`;
      }
    });
    document.getElementById('quick-add-task')?.addEventListener('click', () => {
      const input = document.getElementById('quick-task-input');
      if (input) addTask(input.value, 'quick');
    });
    document.getElementById('quick-task-input')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const input = document.getElementById('quick-task-input');
        if (input) addTask(input.value, 'quick');
      }
    });
    document.getElementById('quick-task')?.addEventListener('click', () => {
      const input = document.getElementById('quick-task-input');
      if (!input) return;
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus({ preventScroll: true });
    });
    document.getElementById('add-task')?.addEventListener('click', () => {
      const input = document.getElementById('task-input');
      if (input) addTask(input.value);
    });
    document.getElementById('task-input')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const input = document.getElementById('task-input');
        if (input) addTask(input.value);
      }
    });
    document.getElementById('breath-start')?.addEventListener('click', startBreathing);
    document.getElementById('breath-stop')?.addEventListener('click', stopBreathing);
    document.getElementById('grounding-reset')?.addEventListener('click', () => {
      document.querySelectorAll('.grounding-check').forEach((check) => check.checked = false);
      updateGroundingProgress();
    });

    document.querySelectorAll('.timer-mode').forEach((button) => {
      button.addEventListener('click', () => selectTimerMode(button.dataset.timer));
    });
    document.getElementById('timer-toggle')?.addEventListener('click', toggleTimer);
    document.getElementById('timer-reset')?.addEventListener('click', () => selectTimerMode(timerMode));
    document.getElementById('download-report')?.addEventListener('click', downloadReport);
    document.getElementById('add-friend')?.addEventListener('click', saveFriend);
    document.getElementById('remove-friend')?.addEventListener('click', removeSelectedFriend);
    document.getElementById('friend-contact-type')?.addEventListener('change', updateContactInput);
    updateContactInput();
    document.getElementById('reset-session')?.addEventListener('click', clearLocalData);

    bindFileInput();
    createSignoutButtonIfNeeded();
    bindAuth();
    bindAuthGate();
    bindAffirmationSwitcher();
    renderAuthReasonOptions();

    if (supabaseClient) {
      const { data } = await supabaseClient.auth.getSession();
      if (data.session?.user) {
        currentUser = { id: data.session.user.id, email: data.session.user.email };
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(currentUser));
      } else {
        currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.session);
      }
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        currentUser = session?.user ? { id: session.user.id, email: session.user.email } : null;
        if (currentUser) localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(currentUser));
        else localStorage.removeItem(STORAGE_KEYS.session);
        updateAuthButton();
        if (currentUser) loadStateFromSupabase();
      });
    } else {
      const storedSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || 'null');
      if (storedSession?.email) currentUser = storedSession;
    }
    await loadStateFromSupabase();
    updateAuthButton();
    renderApplication();
    if (!currentUser?.email) openAuth();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  let breathInterval = null;
  let breathPhase = 0;
  let breathTimer = 4;
  function setBreathPhase() {
    const phases = [
      { name: 'Breathe in', className: 'inhale' },
      { name: 'Hold', className: 'hold-in' },
      { name: 'Breathe out', className: 'exhale' },
      { name: 'Hold', className: 'hold-out' }
    ];
    const phase = phases[breathPhase % phases.length];
    const orb = document.getElementById('breath-orb');
    const instruction = document.getElementById('breath-instruction');
    const timer = document.getElementById('breath-timer');
    if (orb) orb.className = `breath-orb ${phase.className} grid place-items-center rounded-full text-center`;
    if (instruction) instruction.textContent = t(`breath.instructions.${phase.className === 'inhale' ? 'inhale' : phase.className === 'hold-in' || phase.className === 'hold-out' ? 'hold' : 'exhale'}`);
    if (timer) timer.textContent = `${breathTimer} ${t('breath.seconds', 'seconds')}`;
    const round = document.getElementById('breath-round');
    if (round) round.textContent = t('breath.round', 'Round {n}').replace('{n}', String(Math.floor(breathPhase / 4) + 1));
  }

  function startBreathing() {
    if (breathInterval) return;
    breathPhase = 0;
    breathTimer = 4;
    setBreathPhase();
    breathInterval = setInterval(() => {
      breathTimer -= 1;
      const timer = document.getElementById('breath-timer');
      if (timer) timer.textContent = `${breathTimer} ${t(breathTimer === 1 ? 'breath.second' : 'breath.seconds', breathTimer === 1 ? 'second' : 'seconds')}`;
      if (breathTimer <= 0) {
        breathPhase += 1;
        breathTimer = 4;
        setBreathPhase();
      }
    }, 1000);
    showToast(t('breath.follow'));
  }

  function stopBreathing() {
    if (breathInterval) clearInterval(breathInterval);
    breathInterval = null;
    const orb = document.getElementById('breath-orb');
    const instruction = document.getElementById('breath-instruction');
    const timer = document.getElementById('breath-timer');
    const round = document.getElementById('breath-round');
    if (orb) orb.className = 'breath-orb grid place-items-center rounded-full bg-slate-100 text-center';
    if (instruction) instruction.textContent = t('breath.paused');
    if (timer) timer.textContent = t('breath.ready');
    if (round) round.textContent = t('breath.paused');
  }

  let timerMode = 'work';
  let timerSeconds = 1500;
  let timerInterval = null;
  function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    if (!display) return;
    const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
    const seconds = String(timerSeconds % 60).padStart(2, '0');
    display.textContent = `${minutes}:${seconds}`;
  }

  function selectTimerMode(mode) {
    timerMode = mode;
    timerSeconds = { work: 1500, short: 300, long: 900 }[mode] || 1500;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    const modeText = document.getElementById('timer-mode');
    if (modeText) modeText.textContent = { work: t('focus.deepFocus'), short: t('focus.shortReset'), long: t('focus.longReset') }[mode];
    document.querySelectorAll('.timer-mode').forEach((button) => {
      const active = button.dataset.timer === mode;
      button.classList.toggle('bg-white', active);
      button.classList.toggle('shadow-sm', active);
      button.classList.toggle('text-slate-700', active);
      button.classList.toggle('text-slate-400', !active);
    });
    const toggle = document.getElementById('timer-toggle');
    if (toggle) toggle.textContent = t('focus.startTimer');
    const status = document.getElementById('timer-status');
    if (status) status.textContent = t('focus.ready');
    updateTimerDisplay();
  }

  function toggleTimer() {
    const toggle = document.getElementById('timer-toggle');
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      if (toggle) toggle.textContent = t('focus.resume');
      const status = document.getElementById('timer-status');
      if (status) status.textContent = t('breath.paused');
      return;
    }
    timerInterval = setInterval(() => {
      timerSeconds -= 1;
      updateTimerDisplay();
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        if (toggle) toggle.textContent = t('focus.startTimer');
        const status = document.getElementById('timer-status');
        if (status) status.textContent = t('focus.windowComplete');
        showToast('Your focus window is complete.');
      }
    }, 1000);
    if (toggle) toggle.textContent = t('focus.pauseTimer');
    const status = document.getElementById('timer-status');
    if (status) status.textContent = timerMode === 'work' ? t('focus.focusWindow') : t('focus.resetMoment');
  }

  let audioContext = null;
  const soundEngine = {};
  function getAudioContext() {
    if (!audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext = new AudioCtor();
    }
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }

  function startSound(type) {
    const context = getAudioContext();
    if (!context) return;
    const gain = context.createGain();
    const slider = document.getElementById('volume-slider');
    gain.gain.value = slider ? Number(slider.value) : 0.2;
    gain.connect(context.destination);

    if (type === 'white') {
      const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();
      soundEngine[type] = source;
      return;
    }

    const oscillator = context.createOscillator();
    oscillator.type = type === 'rain' ? 'triangle' : 'sine';
    oscillator.frequency.value = type === 'rain' ? 180 : 120;
    oscillator.connect(gain);
    oscillator.start();
    soundEngine[type] = oscillator;
  }

  function stopSound(type) {
    const source = soundEngine[type];
    if (!source) return;
    source.stop();
    delete soundEngine[type];
  }

  function bindSoundControls() {
    document.querySelectorAll('.sound-toggle').forEach((toggle) => {
      toggle.addEventListener('change', () => {
        const sound = toggle.dataset.sound;
        if (toggle.checked) {
          startSound(sound);
        } else {
          stopSound(sound);
        }
        const status = document.getElementById('audio-status');
        if (status) status.textContent = Object.keys(soundEngine).length ? 'Playing' : 'Off';
      });
    });

    const slider = document.getElementById('volume-slider');
    if (slider) {
      slider.addEventListener('input', (event) => {
        const value = Number(event.target.value);
        Object.values(soundEngine).forEach((node) => {
          if (node && node.frequency) return;
          // gain is managed by audio chain when created; no direct update required here
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    init();
    bindSoundControls();
    selectTimerMode(timerMode);
    updateTimerDisplay();
    renderApplication();
  });
})();
