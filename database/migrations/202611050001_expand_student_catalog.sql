with seed_rows(category_slug, project_data) as (
  values
    ('artificial-intelligence', array[
      'Study Topic Recommender|Suggests a next study topic using a small set of related subject tags.',
      'Campus FAQ Helper|Finds a matching answer from a prepared list of common campus questions.',
      'Plant Leaf Classifier|Sorts sample leaf pictures into a few learning categories.',
      'Study Time Predictor|Uses sample study hours to estimate a simple revision plan.',
      'Course Review Sentiment|Groups sample course comments as positive, neutral, or negative.',
      'Book Recommendation Helper|Suggests books that share topics with a student’s chosen title.',
      'Handwritten Digit Explorer|Recognizes digits from a small teaching dataset.',
      'Student Support Topic Finder|Groups sample support questions by their main topic.',
      'Smart Study Flashcards|Creates a practice order from answers a learner gets wrong.'
    ]),
    ('python-development', array[
      'Personal Expense Tracker|Records sample spending and summarizes totals by category.',
      'Weather Report CLI|Displays a clear daily weather summary from a public weather API.',
      'Folder Cleanup Preview|Suggests file groups and previews changes before moving copies.',
      'Library Fine Calculator|Calculates a sample book return fee using simple date rules.',
      'Class Timetable Printer|Turns a small schedule into a readable weekly timetable.',
      'Password Strength Checker|Explains basic password strength rules without storing passwords.',
      'Recipe Unit Converter|Converts common recipe measurements with clear rounding.',
      'Campus Lost and Found List|Stores and searches sample lost-item notices.',
      'Quiz Score Analyzer|Reads practice scores and prints a helpful topic summary.'
    ]),
    ('java-development', array[
      'Course Registration Helper|Lets a student review courses and check simple seat limits.',
      'Library Book Loan Tracker|Records sample book loans and shows whether a title is available.',
      'Campus Cafeteria Menu|Shows meals by day and lets students mark a favorite.',
      'Student Gradebook|Organizes sample assessment scores and calculates course totals.',
      'Club Membership Manager|Keeps a searchable list of student club members.',
      'Bank Account Practice App|Demonstrates deposits and withdrawals with sample balances only.',
      'Appointment Queue Manager|Adds sample appointments and displays them in time order.',
      'Inventory Stock Checker|Tracks sample item quantities and flags low stock.',
      'Bus Pass Application Tracker|Shows sample applications and their review status.'
    ]),
    ('data-science', array[
      'Student Survey Explorer|Summarizes sample survey answers with charts and plain-language notes.',
      'Movie Rating Explorer|Compares sample ratings to find patterns by genre.',
      'Campus Energy Use Study|Explores sample electricity readings across buildings.',
      'Plant Growth Data Journal|Charts sample plant measurements over time.',
      'Public Transport Delay Study|Finds common delay patterns in a sample journey dataset.',
      'Study Habit Comparison|Compares anonymized sample study habits with course outcomes.',
      'Local Air Quality Explorer|Shows changes in a sample air-quality dataset by day.',
      'Sports Results Data Story|Summarizes sample match results with simple visual comparisons.',
      'Book Lending Trend Report|Finds popular topics and borrowing patterns in sample records.'
    ]),
    ('mobile-app-development', array[
      'Campus Event Companion|Helps students browse campus events and save favorites.',
      'Daily Habit Builder|Tracks a few personal habits with a simple weekly view.',
      'Student Bus Route Guide|Shows sample campus routes and useful stop information.',
      'Study Pomodoro Timer|Breaks study time into focused sessions and short rests.',
      'Campus Cafeteria Menu App|Lets students browse meals and save preferred dishes.',
      'Personal Reading Log|Records books and tracks reading progress.',
      'Student Budget Buddy|Helps organize sample expenses into simple categories.',
      'Classroom Quiz Practice|Provides short offline quizzes with answer explanations.',
      'Campus Lost Item Reporter|Creates a clear lost-item report with contact instructions.'
    ]),
    ('cloud-computing', array[
      'Cloud File Sharing Demo|Uploads sample documents and shares access through a safe link.',
      'Photo Backup Organizer|Stores sample images in organized cloud folders.',
      'Campus Notice Board Service|Publishes announcements through a small hosted web service.',
      'Weather API Dashboard|Reads a public weather service and displays current conditions.',
      'Cloud Notes Workspace|Saves personal practice notes and opens them on another device.',
      'Online Resume Publisher|Hosts a student portfolio with a simple deployment workflow.',
      'Study Group Link Hub|Keeps shared learning links in a cloud-backed list.',
      'Server Health Status Page|Shows whether a sample web service is available.',
      'Cloud Recipe Collection|Stores and searches a shared collection of sample recipes.'
    ]),
    ('cybersecurity', array[
      'Password Safety Learning Tool|Explains how length and variety can improve a sample password.',
      'Phishing Message Spotter|Highlights warning signs in safe, prewritten example messages.',
      'Privacy Settings Checklist|Guides students through common account privacy choices.',
      'Secure Notes Demonstrator|Shows a safe learning example for protecting local sample notes.',
      'Campus Security Awareness Quiz|Teaches safe online habits with short scenario questions.',
      'File Checksum Verifier|Compares file fingerprints to detect unexpected changes in test files.',
      'Login Attempt Monitor Demo|Explores sample sign-in events and flags unusual patterns.',
      'Data Sharing Permission Guide|Explains who can see sample shared documents.',
      'Safe Link Preview Helper|Shows the visible destination and safety reminders for sample links.'
    ]),
    ('internet-of-things', array[
      'Smart Room Environment Monitor|Displays sample temperature and humidity readings from a sensor.',
      'Automatic Plant Watering Demo|Uses a soil sensor reading to suggest when a plant needs water.',
      'Campus Air Quality Monitor|Shows sample sensor readings and simple comfort guidance.',
      'Smart Parking Space Counter|Counts sample occupied spaces from a small sensor setup.',
      'Water Tank Level Alert|Displays a simulated tank level and a low-level warning.',
      'Classroom Noise Indicator|Uses sample sound-level readings to show a quiet-room indicator.',
      'Home Energy Use Monitor|Summarizes sample power readings from connected devices.',
      'Smart Door Status Display|Shows open or closed states from a safe, simulated sensor.',
      'Weather Station Data Sender|Collects sample outdoor readings and sends them to a dashboard.'
    ]),
    ('data-analytics', array[
      'Campus Attendance Insights|Summarizes sample attendance records to show class patterns.',
      'Student Club Budget Tracker|Groups sample club expenses and compares them with a budget.',
      'Library Visit Dashboard|Shows sample library visits by day and time.',
      'Cafeteria Sales Summary|Compares sample daily meal sales and highlights popular choices.',
      'Course Feedback Report|Turns sample course feedback into clear topic summaries.',
      'Student Event Registration Report|Tracks sample registrations and available event capacity.',
      'Campus Transport Usage Report|Compares sample passenger counts across routes.',
      'Study Room Usage Dashboard|Shows sample room bookings and busy time periods.',
      'Project Progress Overview|Summarizes sample task status for a student team.'
    ])
),
parsed_rows as (
  select
    s.category_slug,
    split_part(item, '|', 1) as title,
    split_part(item, '|', 2) as short_description
  from seed_rows s
  cross join lateral unnest(s.project_data) as items(item)
),
project_rows as (
  select
    c.id as category_id,
    p.category_slug || '-' ||
      trim(both '-' from regexp_replace(lower(p.title), '[^a-z0-9]+', '-', 'g')) as slug,
    p.title,
    p.short_description,
    case mod(row_number() over (partition by p.category_slug order by p.title), 3)
      when 1 then 'Basic'
      when 2 then 'Mini'
      else 'Major'
    end as project_type,
    case mod(row_number() over (partition by p.category_slug order by p.title), 4)
      when 0 then 'Intermediate'
      else 'Beginner'
    end as difficulty,
    c.technologies,
    p.short_description as overview,
    'It helps students organize this task in one clear place instead of relying on scattered notes or repeated manual steps.' as problem_solved,
    'A student enters or chooses information, the app checks it, and then shows a clear result that is easy to understand.' as how_it_works,
    'Schools, clubs, and small teams use similar tools to make everyday tasks easier to manage.' as real_world_application,
    array['Clear starting screen', 'Main task flow', 'Helpful result or summary']::text[] as main_features,
    case c.slug
      when 'web-development' then array['HTML', 'CSS', 'JavaScript', 'React']::text[]
      when 'mobile-app-development' then array['Flutter', 'Dart']::text[]
      else array[]::text[]
    end as frontend_technologies,
    case c.slug
      when 'artificial-intelligence' then array['Python']::text[]
      when 'python-development' then array['Python', 'Flask']::text[]
      when 'java-development' then array['Java', 'Spring Boot']::text[]
      when 'cloud-computing' then array['Node.js']::text[]
      when 'cybersecurity' then array['Python']::text[]
      else array[]::text[]
    end as backend_technologies,
    case c.slug
      when 'python-development' then array['SQLite']::text[]
      when 'java-development' then array['MySQL']::text[]
      when 'mobile-app-development' then array['Firebase']::text[]
      when 'data-analytics' then array['SQL']::text[]
      else array[]::text[]
    end as database_technologies,
    case c.slug
      when 'artificial-intelligence' then array['scikit-learn', 'pandas']::text[]
      when 'python-development' then array[]::text[]
      when 'java-development' then array[]::text[]
      when 'mobile-app-development' then array[]::text[]
      when 'cloud-computing' then array['AWS', 'Docker']::text[]
      when 'cybersecurity' then array['OWASP', 'Linux']::text[]
      when 'data-analytics' then array['Excel', 'Power BI']::text[]
      else c.technologies
    end as other_tools,
    coalesce((
      select jsonb_object_agg(tech.value,
        case tech.value
          when 'HTML' then 'HTML gives a web page its content and structure.'
          when 'CSS' then 'CSS controls the colors, spacing, and layout of a web page.'
          when 'JavaScript' then 'JavaScript makes web pages respond to user actions.'
          when 'React' then 'React helps build a screen from reusable pieces.'
          when 'Flutter' then 'Flutter helps build phone and tablet screens from shared code.'
          when 'Dart' then 'Dart is the programming language commonly used with Flutter.'
          when 'Python' then 'Python is a readable language for app logic and data tasks.'
          when 'Java' then 'Java is used to build structured applications and services.'
          when 'Node.js' then 'Node.js runs JavaScript code on a server.'
          when 'Spring Boot' then 'Spring Boot helps Java apps provide web services.'
          when 'Flask' then 'Flask is a small Python tool for building web routes.'
          when 'Express' then 'Express helps a Node.js server handle web requests.'
          when 'PostgreSQL' then 'PostgreSQL stores related app data in tables.'
          when 'MySQL' then 'MySQL stores app information in structured tables.'
          when 'SQLite' then 'SQLite is a small database suited to learning projects.'
          when 'Firebase' then 'Firebase provides hosted tools for app data and sign-in.'
          when 'Supabase' then 'Supabase provides a hosted database and app services.'
          when 'pandas' then 'pandas helps organize and explore tables of data.'
          when 'Jupyter' then 'Jupyter notebooks let you mix code, notes, and results.'
          when 'scikit-learn' then 'scikit-learn provides tools for learning from sample data.'
          when 'Arduino' then 'Arduino can read sensors and control small devices.'
          when 'ESP32' then 'ESP32 is a small board that can connect sensors to Wi-Fi.'
          when 'MQTT' then 'MQTT sends small messages between connected devices.'
          when 'AWS' then 'AWS provides online services for hosting apps and files.'
          when 'Docker' then 'Docker packages an app so it can run consistently.'
          when 'Power BI' then 'Power BI turns data into interactive reports.'
          when 'Excel' then 'Excel helps organize data and make simple charts.'
          else tech.value || ' is used to build or support this project.'
        end)
      from unnest(c.technologies) as tech(value)
    ), '{}'::jsonb) as technology_explanations,
    array['Break a task into smaller steps', 'Build and test a useful workflow', 'Explain how the chosen tools fit together']::text[] as learning_outcomes,
    case mod(row_number() over (partition by p.category_slug order by p.title), 3)
      when 1 then '2–4 weeks'
      when 2 then '4–6 weeks'
      else '6–8 weeks'
    end as suggested_duration
  from parsed_rows p
  join public.project_categories c on c.slug = p.category_slug
)
insert into public.projects (
  category_id, slug, title, short_description, project_type, difficulty, technologies,
  overview, problem_solved, how_it_works, real_world_application, main_features,
  frontend_technologies, backend_technologies, database_technologies, other_tools,
  technology_explanations, learning_outcomes, suggested_duration, published
)
select
  category_id, slug, title, short_description, project_type, difficulty, technologies,
  overview, problem_solved, how_it_works, real_world_application, main_features,
  frontend_technologies, backend_technologies, database_technologies, other_tools,
  technology_explanations, learning_outcomes, suggested_duration, true
from project_rows
on conflict (slug) do update set
  category_id = excluded.category_id,
  title = excluded.title,
  short_description = excluded.short_description,
  project_type = excluded.project_type,
  difficulty = excluded.difficulty,
  technologies = excluded.technologies,
  overview = excluded.overview,
  problem_solved = excluded.problem_solved,
  how_it_works = excluded.how_it_works,
  real_world_application = excluded.real_world_application,
  main_features = excluded.main_features,
  frontend_technologies = excluded.frontend_technologies,
  backend_technologies = excluded.backend_technologies,
  database_technologies = excluded.database_technologies,
  other_tools = excluded.other_tools,
  technology_explanations = excluded.technology_explanations,
  learning_outcomes = excluded.learning_outcomes,
  suggested_duration = excluded.suggested_duration,
  published = true;

alter table public.demo_bookings
  alter column project_id drop not null,
  alter column preferred_time set default 'Not specified';

alter table public.demo_bookings
  add column if not exists student_phone text not null default '',
  add column if not exists student_college text not null default '',
  add column if not exists student_department text not null default '';

alter table public.demo_bookings
  drop constraint if exists demo_bookings_preferred_time_check;

alter table public.demo_bookings
  add constraint demo_bookings_preferred_time_check
  check (char_length(btrim(preferred_time)) between 3 and 80);

alter table public.demo_bookings
  drop constraint if exists demo_bookings_contact_fields_check;

alter table public.demo_bookings
  add constraint demo_bookings_contact_fields_check
  check (
    char_length(student_phone) <= 40
    and char_length(student_college) <= 180
    and char_length(student_department) <= 120
  );
