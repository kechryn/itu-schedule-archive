/**
 * UI strings.
 *
 * Only the interface is translated. Course titles, instructor names and
 * building codes come from ITU OBS and are left exactly as published — they
 * are the record, and a translated course title would not match what a student
 * sees in the official system.
 *
 * The Turkish metadata is written around the phrases people actually search
 * for — "İTÜ ders programı", "ders programı arşivi", "CRN" — rather than
 * translated from the English word for word.
 */
import type { Locale } from './config';

const en = {
    meta: {
        home: {
            title: 'ITU Schedule Archive — Course Schedules and Timetable Planner',
            description:
                'Searchable archive of Istanbul Technical University course schedules, ' +
                'covering every term ITU OBS has published since 2016, with a planner ' +
                'that builds conflict-free timetables from the courses you pick.',
        },
        archive: { title: 'Course Archive', social: 'ITU Course Archive' },
        wizard: {
            title: 'Schedule Wizard',
            social: 'ITU Schedule Wizard',
            description:
                'Pick your ITU courses, mark which are required and which are electives, ' +
                'choose the days you want free, and generate conflict-free timetables from ' +
                'every combination of sections that fits.',
        },
        calendar: {
            title: 'Weekly Calendar',
            social: 'ITU Weekly Calendar',
            description:
                'Your selected ITU courses laid out on a weekly grid, with clashes flagged. ' +
                'Export the timetable as PNG, JPG, SVG or PDF — a PNG carries the selection ' +
                'inside it, so importing the image restores the schedule.',
        },
        about: {
            title: 'About',
            social: 'About — ITU Schedule Archive',
            description:
                'Where the course data comes from, how often it is refreshed, and how the ' +
                'archive and schedule planner are built. Open source, no account, no tracking.',
        },
        archiveDescription: (courses: string, terms: number, from: string, to: string) =>
            `Browse ${courses} Istanbul Technical University course sections across ` +
            `${terms} terms, from ${from} to ${to}. Filter by term, level and subject ` +
            'code, or search by course code, title or instructor.',
        termTitle: (label: string) => `${label} Course Schedule`,
        termSocial: (label: string) => `${label} — ITU Course Schedule`,
        termDescription: (label: string, name: string, count: string) =>
            `All ${count} course sections Istanbul Technical University published for ` +
            `${label} (${name}). Search by course code, title or instructor and see CRN, ` +
            'meeting days and times, building, room, capacity and enrolment.',
        /** OBS stores seasons in English; these are the display forms. */
        seasons: { Fall: 'Fall', Spring: 'Spring', Summer: 'Summer' } as Record<string, string>,
        keywords: [
            'ITU',
            'Istanbul Technical University',
            'course schedule',
            'CRN',
            'ITU OBS',
            'timetable planner',
            'course archive',
        ],
    },

    nav: {
        brand: 'ITU Scheduler',
        home: 'Home',
        archive: 'Archive',
        wizard: 'Wizard',
        calendar: 'Calendar',
        about: 'About',
        openMenu: 'Open main menu',
        switchLanguage: 'Türkçe',
        switchLanguageTitle: 'Bu sayfayı Türkçe görüntüle',
    },

    home: {
        titleLead: 'ITU Course',
        titleAccent: 'Archive & Planner.',
        subtitle: 'A fast, open-source planner for Istanbul Technical University students.',
        browseArchive: 'Browse Archive',
        startWizard: 'Start Wizard',
        features: {
            archive: {
                title: 'Course Archive',
                description: 'Browse detailed course data from past semesters.',
                link: 'Explore Archive',
            },
            wizard: {
                title: 'Schedule Wizard',
                description: 'Generate conflict-free schedules from your course list in seconds.',
                link: 'Launch Wizard',
            },
            calendar: {
                title: 'Weekly Calendar',
                description: 'Visualize your week and export your schedule to PDF or image.',
                link: 'Open Calendar',
            },
            source: {
                title: 'Open Source',
                description: 'Fork the project on GitHub and adapt it for your own campus.',
                link: 'Learn More',
            },
        },
        footer: 'ITU Scheduler. Not affiliated with Istanbul Technical University.',
    },

    archive: {
        titleLead: 'Course',
        titleAccent: 'Archive.',
        intro: 'Browse course schedules from every archived semester. Data comes straight from ITU’s public records.',
        backToTerms: 'Back to Terms',
        inSchedule: 'in Schedule',
        browse: 'Browse Archive',
        stepTerm: '1. Academic Term',
        stepLevel: '2. Course Level',
        stepSubject: '3. Subject Code',
        year: 'Year',
        semester: 'Semester',
        selectYear: 'Year',
        selectSemester: 'Select Semester',
        selectCode: 'Select Code',
        loading: 'Loading...',
        loadingShort: 'Loading…',
        errorTitle: 'Something went wrong',
        errorBody: 'Could not load courses for this term. Please try again.',
        readyTitle: 'Ready to explore',
        readyBodyLead: 'Select a ',
        readyBodyAccent: 'Subject Code',
        readyBodyTail: ' above to view the full schedule.',
        startTitle: 'Start Browsing',
        startBodyLead: 'Select a ',
        startBodyAccent: 'Term and Level',
        startBodyTail: ' to begin your search.',
        foundClasses: (n: number) => `Found ${n} classes available`,
        termHeading: (label: string) => `${label} Course Schedule`,
    },

    catalog: {
        heading: (term: string) => `All courses in ${term}`,
        intro: (courses: string, subjects: number) =>
            `${courses} courses across ${subjects} subject codes, with the number of ` +
            'sections in brackets. Use the filters above for meeting times, instructors ' +
            'and capacity.',
    },

    table: {
        searchPlaceholder: 'Search by code, title, or instructor...',
        allDays: 'All Days',
        anyTime: 'Any Time',
        morning: 'Morning',
        afternoon: 'Afternoon',
        reset: 'Reset',
        showing: (shown: number, total: number) => `Showing ${shown} of ${total} courses`,
        action: 'Action',
        crn: 'CRN',
        code: 'Code',
        title: 'Title',
        instructor: 'Instructor',
        dayTime: 'Day/Time',
        building: 'Building',
        stats: 'Stats',
        location: 'Location',
        schedule: 'Schedule',
        enrolled: 'Enrolled',
        enrollment: 'Enrollment',
        addToSchedule: 'Add to Schedule',
        removeFromSchedule: 'Remove from Schedule',
        schedulePreview: 'Schedule Preview',
        noCourses: 'No courses found.',
        noMatch: 'No courses match your filters.',
        tba: 'TBA',
        days: {
            Monday: 'Monday',
            Tuesday: 'Tuesday',
            Wednesday: 'Wednesday',
            Thursday: 'Thursday',
            Friday: 'Friday',
            Saturday: 'Saturday',
            Sunday: 'Sunday',
        } as Record<string, string>,
        dayInitials: ['M', 'T', 'W', 'R', 'F'],
    },

    wizard: {
        titleLead: 'Schedule',
        titleAccent: 'Wizard.',
        intro: 'Automatically generate conflict-free schedules based on your selected courses and free days.',
        steps: { term: 'Term', courses: 'Courses', preferences: 'Preferences', schedule: 'Schedule' },
        back: 'Back',
        next: 'Next Step',

        one: {
            heading: 'Select Academic Term',
            body: 'Choose the academic year and semester to begin planning your schedule.',
            importTitle: 'Have a previous configuration?',
            importBody: 'Import a .itusched file to restore your previous wizard setup.',
            importButton: 'Import Config',
            academicYear: 'Academic Year',
            semester: 'Semester',
            selectYear: 'Select Year',
            selectSemester: 'Select Semester',
            selectedTerm: 'Selected Term',
            loadingTerms: 'Loading terms...',
        },

        two: {
            findCourses: 'Find Courses',
            findHint: 'Search via Code (e.g. FIZ 101) or Subject (e.g. ATA)',
            searchPlaceholder: 'e.g. FIZ 101 or ATA',
            allOf: (subject: string) => `All ${subject} Courses`,
            bulkSelection: 'Bulk Selection',
            addAll: 'Add All',
            add: 'Add',
            addCourse: 'Add Course',
            noResults: 'No courses found',
            typePrompt: 'Type code or subject',
            mustCourses: 'Must Courses',
            mustHint: 'Courses you definitely want to take.',
            clear: 'Clear',
            selectedCount: (n: number) => `${n} Selected`,
            dropHint: 'Drag courses (or Subjects like “ATA”) here',
            selectiveGroups: 'Selective Groups',
            addGroup: 'Add Group',
            groupName: (n: number) => `Elective Group ${n}`,
            pick: 'Pick',
            ofCourses: (n: number) => `of ${n} courses`,
            dragHere: 'Drag courses here',
            noGroupsTitle: 'No selective groups yet.',
            noGroupsBody: 'Create a group to model “Pick 2 of 5” scenarios.',
            addPrefix: 'Add',
            selectDestination: 'Select Destination',
            mustCourse: 'Must Course',
            mustCourseHint: 'I definitely want this',
            pickOf: (required: number, total: number) => `Pick ${required} of ${total}`,
        },

        three: {
            heading: 'Configure Preferences',
            body: 'Customize your schedule to fit your lifestyle.',
            freeDays: 'Free Days',
            freeDaysHint: 'Days you want completely off',
            morningClasses: 'Morning Classes',
            morningHint: 'Avoid 08:30 - 10:30 classes',
            avoiding: 'Avoiding Mornings',
            fine: 'Mornings are Fine',
            dayShort: {
                Monday: 'Mon',
                Tuesday: 'Tue',
                Wednesday: 'Wed',
                Thursday: 'Thu',
                Friday: 'Fri',
            } as Record<string, string>,
        },

        four: {
            generating: 'Generating Schedules',
            analyzing: 'Analyzing combinations...',
            errorTitle: 'Something went wrong',
            errorGeneric: 'An error occurred while generating schedules.',
            emptyTitle: 'No Valid Schedules Found',
            emptyBody:
                'We couldn’t find any combination that satisfies all requirements. ' +
                'Try reducing constraints or changing “Must” courses to “Selective”.',
            heading: 'Generated Schedules',
            found: (n: number) => `Found ${n} valid combinations`,
            topMatch: 'Top Match',
            exportConfig: 'Export Wizard Config',
            option: (n: number) => `Option #${n}`,
            match: 'Match',
            moreCourses: (n: number) => `+ ${n} more courses`,
            viewTimetable: 'View Timetable',
            details: 'Schedule Details',
            coursesAndMatch: (n: number, match: number) => `${n} Courses • ${match}% Match`,
            courseList: 'Course List',
            unknown: 'Unknown',
        },
    },

    calendar: {
        titleLead: 'Weekly',
        titleAccent: 'Planner.',
        intro: 'Drag courses from the sidebar to visualize your week.',
        conflictTitle: 'Schedule Conflict Detected',
        conflictBody: (n: number) => `${n} overlapping course pairs found.`,
        tabSchedule: 'Schedule',
        tabCourses: 'Courses & Selection',
        selectedItems: 'Selected Items',
        noneSelected: 'No courses selected.',
        timeGrid: 'Time Grid',

        selector: {
            addCourses: 'Add Courses',
            term: 'Term',
            level: 'Level',
            selectTerm: 'Select Term',
            selectLevel: 'Select Level',
            allLevels: 'All Levels',
            searchPlaceholder: 'Search (e.g. MAT 103)...',
            sections: 'Sections',
            backToResults: '← Back to results',
            noSections: 'No sections found.',
            typeToSearch: 'Type to search...',
            noCourses: 'No courses found',
        },

        toolbar: {
            export: 'Export',
            import: 'Import',
            png: 'PNG Image',
            jpg: 'JPG Image',
            svg: 'SVG Vector',
            pdf: 'PDF Document',
            itusched: 'ITU Sched File',
            replaceTitle: 'Replace Current Schedule?',
            replaceBody: (current: number, incoming: number) =>
                `This will remove your current ${current} course(s) and import ${incoming} course(s) from the file.`,
            cancel: 'Cancel',
            replace: 'Replace & Import',
            exported: 'Schedule exported successfully!',
            exportedAs: (format: string) => `Exported as ${format}!`,
            exportFailed: 'Export failed. Please try again.',
            imported: (n: number) => `Imported ${n} courses!`,
            noData: 'No valid course data found in file',
            importFailed: 'Failed to import file',
        },
    },

    about: {
        titleLead: 'About',
        titleAccent: 'ITU Scheduler.',
        intro: 'An open-source tool that helps Istanbul Technical University students plan their semesters with ease.',
        cards: {
            archive: {
                title: 'Course Archive',
                body: 'A searchable database of past schedules to analyze trends and verify course details.',
            },
            wizard: {
                title: 'Schedule Wizard',
                body: 'Generates conflict-free schedule combinations from your course list in seconds.',
            },
            calendar: {
                title: 'Interactive Calendar',
                body: 'Visualize your week with a drag-and-drop ready interface. Export to PDF or image.',
            },
        },
        stats: { terms: 'Terms Archived', courses: 'Total Courses', open: 'Open Source' },
        devTitle: 'For Developers',
        devBody:
            'The codebase is fully open-source. Fork the repository and adapt it for ' +
            'your own university’s schedule system.',
        viewOnGitHub: 'View on GitHub',
    },

    select: {
        placeholder: 'Select...',
        search: 'Type to search...',
        noMatch: (q: string) => `No options match “${q}”`,
    },

    modal: { gotIt: 'Got it' },

    help: {
        howItWorks: 'How it Works',
        archive: {
            title: 'How to use the Archive',
            leadPrefix: 'The ',
            leadStrong: 'Course Archive',
            lead: ' lets you browse schedules from past semesters and build a mock schedule.',
            s1: 'Find Courses',
            s1body: 'Select a Term, Level (Undergraduate/Graduate), and Subject Code to view available classes.',
            s2: 'Build Your Basket',
            s2before: 'Click the ',
            s2add: 'Add',
            s2after: ' button on any course to add it to your global basket.',
            s3: 'View Schedule & Conflicts',
            s3before: 'All added courses are sent to the ',
            s3page: 'Calendar Page',
            s3after: '. Go there to see your weekly schedule grid and check for specific time conflicts.',
            tipLabel: 'Tip:',
            tip: 'Your selected courses are saved automatically as you browse different subjects!',
        },
        wizard: {
            title: 'Using the Schedule Wizard',
            leadPrefix: 'The ',
            leadStrong: 'Wizard',
            lead: ' automatically generates hundreds of possible non-conflicting schedules for you.',
            s1: 'Plan Courses',
            s1body: 'Search and add courses. Mark them as Must (required) or create Selective Groups (e.g. “Pick 2 of 5 Electives”).',
            s2: 'Set Constraints',
            s2body: 'Choose days you want free or strict hours to avoid (e.g. “No Morning Classes”).',
            s3: 'Generate & Pick',
            s3body: 'We’ll find all valid combinations. Pick the one you like best and export it!',
        },
        calendar: {
            title: 'Using the Calendar',
            leadPrefix: 'The ',
            leadStrong: 'Calendar',
            lead: ' helps you visualize your weekly schedule and check for conflicts.',
            s1: 'Add Courses',
            s1body: 'Search for courses in the sidebar and click to add them. They’ll appear as coloured blocks on the grid.',
            s2: 'Check Conflicts',
            s2body: 'If two courses overlap, they will turn RED and you’ll see an alert banner at the top.',
            s3: 'Export & Save',
            s3body: 'Download your schedule as PNG or PDF, or export the configuration to reload it later.',
        },
    },
};

const tr: typeof en = {
    meta: {
        home: {
            title: 'İTÜ Ders Programı Arşivi — Ders Programı Oluşturucu',
            description:
                'İstanbul Teknik Üniversitesi ders programlarının aranabilir arşivi: 2016’dan bu yana ' +
                'İTÜ OBS’de yayımlanan her dönem, CRN’leri, öğretim üyeleri ve ders saatleriyle birlikte. ' +
                'Seçtiğiniz derslerden çakışmasız ders programı oluşturan planlayıcı da dahil.',
        },
        archive: { title: 'Ders Programı Arşivi', social: 'İTÜ Ders Programı Arşivi' },
        wizard: {
            title: 'Ders Programı Oluşturucu',
            social: 'İTÜ Ders Programı Oluşturucu',
            description:
                'İTÜ derslerinizi seçin, zorunlu ve seçmeli olarak işaretleyin, boş kalmasını istediğiniz ' +
                'günleri belirleyin; uyan bütün şube kombinasyonlarından çakışmasız ders programı üretin.',
        },
        calendar: {
            title: 'Haftalık Ders Programı',
            social: 'İTÜ Haftalık Ders Programı',
            description:
                'Seçtiğiniz İTÜ derslerini haftalık takvimde görün, çakışmalar işaretlensin. ' +
                'Programı PNG, JPG, SVG veya PDF olarak indirin — PNG dosyası seçiminizi içinde taşır, ' +
                'görseli geri yüklediğinizde programınız geri gelir.',
        },
        about: {
            title: 'Hakkında',
            social: 'Hakkında — İTÜ Ders Programı Arşivi',
            description:
                'Ders verileri nereden geliyor, ne sıklıkla yenileniyor, arşiv ve program oluşturucu ' +
                'nasıl çalışıyor. Açık kaynak, üyelik yok, takip yok.',
        },
        archiveDescription: (courses: string, terms: number, from: string, to: string) =>
            `${terms} dönemde toplam ${courses} İTÜ ders şubesine göz atın — ${from} ` +
            `döneminden ${to} dönemine. Dönem, seviye ve branş koduna göre filtreleyin ya da ` +
            'ders kodu, ders adı veya öğretim üyesiyle arayın.',
        termTitle: (label: string) => `${label} Ders Programı`,
        termSocial: (label: string) => `${label} İTÜ Ders Programı`,
        termDescription: (label: string, name: string, count: string) =>
            `İstanbul Teknik Üniversitesi'nin ${label} dönemi için açtığı ${count} ders ` +
            `şubesinin tamamı (${name}). Ders kodu, ders adı veya öğretim üyesiyle arayın; ` +
            'CRN, gün ve saat, bina, derslik, kontenjan ve kayıtlı sayısını görün.',
        /** OBS stores seasons in English; these are the display forms. */
        seasons: { Fall: 'Güz', Spring: 'Bahar', Summer: 'Yaz' } as Record<string, string>,
        keywords: [
            'İTÜ ders programı',
            'İTÜ ders programı arşivi',
            'ders programı oluşturucu',
            'İTÜ ders saatleri',
            'İTÜ CRN',
            'İTÜ OBS ders programı',
            'İstanbul Teknik Üniversitesi ders programı',
            'ders programı hazırlama',
        ],
    },

    nav: {
        brand: 'İTÜ Ders Programı',
        home: 'Ana Sayfa',
        archive: 'Arşiv',
        wizard: 'Oluşturucu',
        calendar: 'Takvim',
        about: 'Hakkında',
        openMenu: 'Menüyü aç',
        switchLanguage: 'English',
        switchLanguageTitle: 'View this page in English',
    },

    home: {
        titleLead: 'İTÜ Ders Programı',
        titleAccent: 'Arşivi ve Oluşturucusu.',
        subtitle: 'İstanbul Teknik Üniversitesi öğrencileri için hızlı, açık kaynaklı ders programı aracı.',
        browseArchive: 'Arşive Göz At',
        startWizard: 'Program Oluştur',
        features: {
            archive: {
                title: 'Ders Programı Arşivi',
                description: 'Geçmiş dönemlerin ders programlarını CRN, öğretim üyesi ve saat bilgisiyle inceleyin.',
                link: 'Arşive Git',
            },
            wizard: {
                title: 'Program Oluşturucu',
                description: 'Ders listenizden saniyeler içinde çakışmasız ders programları üretin.',
                link: 'Oluşturucuyu Aç',
            },
            calendar: {
                title: 'Haftalık Takvim',
                description: 'Haftanızı görün, programınızı PDF veya görsel olarak indirin.',
                link: 'Takvimi Aç',
            },
            source: {
                title: 'Açık Kaynak',
                description: 'Projeyi GitHub’da fork’layın ve kendi kampüsünüze uyarlayın.',
                link: 'Daha Fazla',
            },
        },
        footer: 'İTÜ Ders Programı. İstanbul Teknik Üniversitesi ile bağlantılı değildir.',
    },

    archive: {
        titleLead: 'Ders Programı',
        titleAccent: 'Arşivi.',
        intro: 'Arşivdeki bütün dönemlerin ders programlarına göz atın. Veriler doğrudan İTÜ’nün açık kayıtlarından geliyor.',
        backToTerms: 'Dönemlere Dön',
        inSchedule: 'ders seçildi',
        browse: 'Arşivde Ara',
        stepTerm: '1. Dönem',
        stepLevel: '2. Ders Seviyesi',
        stepSubject: '3. Ders Branş Kodu',
        year: 'Yıl',
        semester: 'Yarıyıl',
        selectYear: 'Yıl',
        selectSemester: 'Yarıyıl seçin',
        selectCode: 'Kod seçin',
        loading: 'Yükleniyor...',
        loadingShort: 'Yükleniyor…',
        errorTitle: 'Bir şeyler ters gitti',
        errorBody: 'Bu dönemin dersleri yüklenemedi. Lütfen tekrar deneyin.',
        readyTitle: 'Hazırsınız',
        readyBodyLead: 'Programı görmek için yukarıdan bir ',
        readyBodyAccent: 'Branş Kodu',
        readyBodyTail: ' seçin.',
        startTitle: 'Aramaya Başlayın',
        startBodyLead: 'Başlamak için bir ',
        startBodyAccent: 'Dönem ve Seviye',
        startBodyTail: ' seçin.',
        foundClasses: (n: number) => `${n} şube bulundu`,
        termHeading: (label: string) => `${label} Ders Programı`,
    },

    catalog: {
        heading: (term: string) => `${term} döneminin bütün dersleri`,
        intro: (courses: string, subjects: number) =>
            `${subjects} branş kodu altında ${courses} ders; köşeli parantez içindeki sayı şube adedidir. ` +
            'Ders saatleri, öğretim üyeleri ve kontenjan için yukarıdaki filtreleri kullanın.',
    },

    table: {
        searchPlaceholder: 'Kod, ders adı veya öğretim üyesi ara...',
        allDays: 'Tüm günler',
        anyTime: 'Tüm saatler',
        morning: 'Sabah',
        afternoon: 'Öğleden sonra',
        reset: 'Sıfırla',
        showing: (shown: number, total: number) => `${total} dersin ${shown} tanesi gösteriliyor`,
        action: 'İşlem',
        crn: 'CRN',
        code: 'Kod',
        title: 'Ders Adı',
        instructor: 'Öğretim Üyesi',
        dayTime: 'Gün/Saat',
        building: 'Bina',
        stats: 'Kontenjan',
        location: 'Yer',
        schedule: 'Ders Saati',
        enrolled: 'Kayıtlı',
        enrollment: 'Kayıt',
        addToSchedule: 'Programa ekle',
        removeFromSchedule: 'Programdan çıkar',
        schedulePreview: 'Program önizleme',
        noCourses: 'Ders bulunamadı.',
        noMatch: 'Filtrelerinize uyan ders yok.',
        tba: 'Belirsiz',
        days: {
            Monday: 'Pazartesi',
            Tuesday: 'Salı',
            Wednesday: 'Çarşamba',
            Thursday: 'Perşembe',
            Friday: 'Cuma',
            Saturday: 'Cumartesi',
            Sunday: 'Pazar',
        } as Record<string, string>,
        dayInitials: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'],
    },

    wizard: {
        titleLead: 'Ders Programı',
        titleAccent: 'Oluşturucu.',
        intro: 'Seçtiğiniz derslere ve boş bırakmak istediğiniz günlere göre çakışmasız ders programları üretin.',
        steps: { term: 'Dönem', courses: 'Dersler', preferences: 'Tercihler', schedule: 'Program' },
        back: 'Geri',
        next: 'Devam',

        one: {
            heading: 'Dönem Seçin',
            body: 'Ders programınızı planlamaya başlamak için akademik yıl ve yarıyılı seçin.',
            importTitle: 'Kayıtlı bir yapılandırmanız var mı?',
            importBody: 'Önceki kurulumunuzu geri yüklemek için .itusched dosyanızı yükleyin.',
            importButton: 'Dosya Yükle',
            academicYear: 'Akademik Yıl',
            semester: 'Yarıyıl',
            selectYear: 'Yıl seçin',
            selectSemester: 'Yarıyıl seçin',
            selectedTerm: 'Seçili Dönem',
            loadingTerms: 'Dönemler yükleniyor...',
        },

        two: {
            findCourses: 'Ders Ara',
            findHint: 'Ders kodu (örn. FIZ 101) veya branş kodu (örn. ATA) ile arayın',
            searchPlaceholder: 'örn. FIZ 101 veya ATA',
            allOf: (subject: string) => `Bütün ${subject} dersleri`,
            bulkSelection: 'Toplu seçim',
            addAll: 'Hepsini ekle',
            add: 'Ekle',
            addCourse: 'Dersi ekle',
            noResults: 'Ders bulunamadı',
            typePrompt: 'Ders veya branş kodu yazın',
            mustCourses: 'Zorunlu Dersler',
            mustHint: 'Kesinlikle almak istediğiniz dersler.',
            clear: 'Temizle',
            selectedCount: (n: number) => `${n} seçildi`,
            dropHint: 'Dersleri (veya “ATA” gibi branş kodlarını) buraya sürükleyin',
            selectiveGroups: 'Seçmeli Gruplar',
            addGroup: 'Grup Ekle',
            groupName: (n: number) => `Seçmeli Grup ${n}`,
            pick: 'Seç',
            ofCourses: (n: number) => `/ ${n} ders`,
            dragHere: 'Dersleri buraya sürükleyin',
            noGroupsTitle: 'Henüz seçmeli grup yok.',
            noGroupsBody: '“5 dersten 2’sini seç” gibi durumlar için bir grup oluşturun.',
            addPrefix: 'Ekle:',
            selectDestination: 'Nereye eklensin?',
            mustCourse: 'Zorunlu Ders',
            mustCourseHint: 'Bunu kesinlikle almak istiyorum',
            pickOf: (required: number, total: number) => `${total} dersten ${required} tanesi`,
        },

        three: {
            heading: 'Tercihlerinizi Belirleyin',
            body: 'Ders programınızı kendi düzeninize göre ayarlayın.',
            freeDays: 'Boş Günler',
            freeDaysHint: 'Tamamen boş kalmasını istediğiniz günler',
            morningClasses: 'Sabah Dersleri',
            morningHint: '08:30 - 10:30 arası derslerden kaçın',
            avoiding: 'Sabahlar boş kalsın',
            fine: 'Sabah dersi olabilir',
            dayShort: {
                Monday: 'Pzt',
                Tuesday: 'Sal',
                Wednesday: 'Çar',
                Thursday: 'Per',
                Friday: 'Cum',
            } as Record<string, string>,
        },

        four: {
            generating: 'Programlar Oluşturuluyor',
            analyzing: 'Kombinasyonlar deneniyor...',
            errorTitle: 'Bir şeyler ters gitti',
            errorGeneric: 'Programlar oluşturulurken bir hata oluştu.',
            emptyTitle: 'Uygun Program Bulunamadı',
            emptyBody:
                'Bütün koşulları sağlayan bir kombinasyon bulunamadı. Kısıtları azaltmayı ya da ' +
                '“Zorunlu” dersleri “Seçmeli” yapmayı deneyin.',
            heading: 'Oluşturulan Programlar',
            found: (n: number) => `${n} geçerli kombinasyon bulundu`,
            topMatch: 'En iyi eşleşme',
            exportConfig: 'Yapılandırmayı İndir',
            option: (n: number) => `Seçenek #${n}`,
            match: 'Eşleşme',
            moreCourses: (n: number) => `+ ${n} ders daha`,
            viewTimetable: 'Programı Gör',
            details: 'Program Ayrıntıları',
            coursesAndMatch: (n: number, match: number) => `${n} ders • %${match} eşleşme`,
            courseList: 'Ders Listesi',
            unknown: 'Belirsiz',
        },
    },

    calendar: {
        titleLead: 'Haftalık',
        titleAccent: 'Program.',
        intro: 'Haftanızı görmek için kenar çubuğundan ders ekleyin.',
        conflictTitle: 'Ders Çakışması Var',
        conflictBody: (n: number) => `${n} ders çifti çakışıyor.`,
        tabSchedule: 'Program',
        tabCourses: 'Dersler ve Seçim',
        selectedItems: 'Seçilenler',
        noneSelected: 'Henüz ders seçilmedi.',
        timeGrid: 'Saat Cetveli',

        selector: {
            addCourses: 'Ders Ekle',
            term: 'Dönem',
            level: 'Seviye',
            selectTerm: 'Dönem seçin',
            selectLevel: 'Seviye seçin',
            allLevels: 'Tüm seviyeler',
            searchPlaceholder: 'Ara (örn. MAT 103)...',
            sections: 'Şubeler',
            backToResults: '← Sonuçlara dön',
            noSections: 'Şube bulunamadı.',
            typeToSearch: 'Aramak için yazın...',
            noCourses: 'Ders bulunamadı',
        },

        toolbar: {
            export: 'İndir',
            import: 'Yükle',
            png: 'PNG Görsel',
            jpg: 'JPG Görsel',
            svg: 'SVG Vektör',
            pdf: 'PDF Belge',
            itusched: 'ITU Sched Dosyası',
            replaceTitle: 'Mevcut program değiştirilsin mi?',
            replaceBody: (current: number, incoming: number) =>
                `Mevcut ${current} ders kaldırılacak ve dosyadaki ${incoming} ders yüklenecek.`,
            cancel: 'Vazgeç',
            replace: 'Değiştir ve Yükle',
            exported: 'Program indirildi!',
            exportedAs: (format: string) => `${format} olarak indirildi!`,
            exportFailed: 'İndirme başarısız. Lütfen tekrar deneyin.',
            imported: (n: number) => `${n} ders yüklendi!`,
            noData: 'Dosyada geçerli ders verisi bulunamadı',
            importFailed: 'Dosya yüklenemedi',
        },
    },

    about: {
        titleLead: 'Hakkında:',
        titleAccent: 'İTÜ Ders Programı.',
        intro: 'İstanbul Teknik Üniversitesi öğrencilerinin dönemlerini kolayca planlamasına yarayan açık kaynaklı bir araç.',
        cards: {
            archive: {
                title: 'Ders Programı Arşivi',
                body: 'Geçmiş dönemleri karşılaştırmak ve ders ayrıntılarını doğrulamak için aranabilir bir arşiv.',
            },
            wizard: {
                title: 'Program Oluşturucu',
                body: 'Ders listenizden saniyeler içinde çakışmasız program kombinasyonları üretir.',
            },
            calendar: {
                title: 'Etkileşimli Takvim',
                body: 'Haftanızı görün, PDF veya görsel olarak indirin.',
            },
        },
        stats: { terms: 'Arşivdeki Dönem', courses: 'Toplam Ders', open: 'Açık Kaynak' },
        devTitle: 'Geliştiriciler İçin',
        devBody:
            'Kod tamamen açık kaynak. Depoyu fork’layıp kendi üniversitenizin ders programı ' +
            'sistemine uyarlayabilirsiniz.',
        viewOnGitHub: 'GitHub’da Görüntüle',
    },

    select: {
        placeholder: 'Seçin...',
        search: 'Aramak için yazın...',
        noMatch: (q: string) => `“${q}” ile eşleşen seçenek yok`,
    },

    modal: { gotIt: 'Anladım' },

    help: {
        howItWorks: 'Nasıl çalışır?',
        archive: {
            title: 'Arşiv nasıl kullanılır',
            leadPrefix: '',
            leadStrong: 'Ders Programı Arşivi',
            lead: ', geçmiş dönemlerin ders programlarına bakmanızı ve deneme programı kurmanızı sağlar.',
            s1: 'Dersleri Bulun',
            s1body: 'Açık şubeleri görmek için Dönem, Seviye (Lisans/Lisansüstü) ve Branş Kodu seçin.',
            s2: 'Sepetinizi Oluşturun',
            s2before: 'Herhangi bir dersteki ',
            s2add: 'Ekle',
            s2after: ' düğmesine basarak dersi sepetinize atın.',
            s3: 'Programı ve Çakışmaları Görün',
            s3before: 'Eklediğiniz bütün dersler ',
            s3page: 'Takvim sayfasına',
            s3after: ' gider. Haftalık programınızı ve çakışmaları orada görebilirsiniz.',
            tipLabel: 'İpucu:',
            tip: 'Seçtiğiniz dersler siz farklı branşlara bakarken otomatik olarak saklanır.',
        },
        wizard: {
            title: 'Program Oluşturucuyu kullanmak',
            leadPrefix: '',
            leadStrong: 'Oluşturucu',
            lead: ', sizin için yüzlerce olası çakışmasız ders programını otomatik üretir.',
            s1: 'Dersleri Planlayın',
            s1body: 'Ders arayıp ekleyin. Zorunlu olarak işaretleyin ya da Seçmeli Grup kurun (örn. “5 seçmeliden 2’si”).',
            s2: 'Kısıtları Belirleyin',
            s2body: 'Boş kalmasını istediğiniz günleri veya kaçınmak istediğiniz saatleri seçin (örn. “sabah dersi olmasın”).',
            s3: 'Üretin ve Seçin',
            s3body: 'Bütün geçerli kombinasyonları buluruz. Beğendiğinizi seçip indirin.',
        },
        calendar: {
            title: 'Takvimi kullanmak',
            leadPrefix: '',
            leadStrong: 'Takvim',
            lead: ', haftalık programınızı görmenize ve çakışmaları kontrol etmenize yarar.',
            s1: 'Ders Ekleyin',
            s1body: 'Kenar çubuğundan ders arayıp tıklayın. Dersler cetvelde renkli bloklar olarak görünür.',
            s2: 'Çakışmaları Kontrol Edin',
            s2body: 'İki ders üst üste gelirse KIRMIZI olur ve yukarıda bir uyarı çıkar.',
            s3: 'İndirin ve Saklayın',
            s3body: 'Programınızı PNG veya PDF olarak indirin, ya da sonra geri yüklemek için yapılandırmayı kaydedin.',
        },
    },
};

export type Dictionary = typeof en;

const DICTIONARIES: Record<Locale, Dictionary> = { en, tr };

export function getDictionary(locale: Locale): Dictionary {
    return DICTIONARIES[locale] ?? DICTIONARIES.tr;
}
