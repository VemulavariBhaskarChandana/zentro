create extension if not exists pgcrypto;

create table if not exists public.project_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  description text not null,
  build_examples text not null,
  technologies text[] not null default '{}',
  icon text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.project_categories(id) on delete restrict,
  slug text not null unique,
  title text not null,
  short_description text not null,
  project_type text not null check (project_type in ('Basic', 'Mini', 'Major')),
  difficulty text not null check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  technologies text[] not null default '{}',
  overview text not null,
  problem_solved text not null,
  how_it_works text not null,
  real_world_application text not null,
  main_features text[] not null default '{}',
  frontend_technologies text[] not null default '{}',
  backend_technologies text[] not null default '{}',
  database_technologies text[] not null default '{}',
  other_tools text[] not null default '{}',
  technology_explanations jsonb not null default '{}',
  learning_outcomes text[] not null default '{}',
  suggested_duration text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_category_published_idx
  on public.projects (category_id, published, title);
create index if not exists projects_type_difficulty_idx
  on public.projects (project_type, difficulty)
  where published = true;

create table if not exists public.demo_bookings (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  student_name text not null,
  student_email text not null,
  project_id uuid not null references public.projects(id) on delete restrict,
  preferred_time text not null check (char_length(btrim(preferred_time)) between 3 and 80),
  student_note text not null default '' check (char_length(student_note) <= 1200),
  status text not null default 'requested'
    check (status in ('requested', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists demo_bookings_owner_created_idx
  on public.demo_bookings (clerk_user_id, created_at desc);

create or replace function public.set_project_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_project_updated_at();

drop trigger if exists demo_bookings_set_updated_at on public.demo_bookings;
create trigger demo_bookings_set_updated_at
before update on public.demo_bookings
for each row execute function public.set_project_updated_at();

alter table public.project_categories enable row level security;
alter table public.projects enable row level security;
alter table public.demo_bookings enable row level security;

revoke all on public.project_categories, public.projects, public.demo_bookings
  from anon, authenticated;
grant all on public.project_categories, public.projects, public.demo_bookings
  to service_role;

insert into public.project_categories (slug, name, description, build_examples, technologies, icon)
values
  ('web-development', 'Web Development', 'Create websites and web apps that people use in a browser.', 'Build learning sites, online shops, booking tools, and student portals.', array['HTML', 'CSS', 'JavaScript', 'React'], 'globe'),
  ('artificial-intelligence', 'Artificial Intelligence & Machine Learning', 'Help computers find patterns and make useful predictions from examples.', 'Build study helpers, image sorters, and simple recommendation tools.', array['Python', 'scikit-learn', 'pandas'], 'brain'),
  ('python-development', 'Python Development', 'Use a readable, beginner-friendly language to build useful programs.', 'Build automation scripts, small APIs, and helpful desktop tools.', array['Python', 'Flask', 'SQLite'], 'code'),
  ('java-development', 'Java Development', 'Build reliable applications using a language used in many courses and companies.', 'Build campus systems, library tools, and Android applications.', array['Java', 'Spring Boot', 'MySQL'], 'coffee'),
  ('data-science', 'Data Science', 'Turn data into clear answers with charts, summaries, and simple models.', 'Explore survey results, public datasets, and student performance trends.', array['Python', 'pandas', 'Jupyter'], 'chart'),
  ('mobile-app-development', 'Mobile App Development', 'Make apps that people can use on phones and tablets.', 'Build campus guides, habit trackers, and event companion apps.', array['Flutter', 'Dart', 'Firebase'], 'mobile'),
  ('cloud-computing', 'Cloud Computing', 'Run apps and store files on internet-connected computers managed for you.', 'Build file-sharing tools, hosted websites, and small cloud services.', array['AWS', 'Docker', 'Node.js'], 'cloud'),
  ('cybersecurity', 'Cybersecurity', 'Learn how to protect accounts, apps, and information from misuse.', 'Build password helpers, safe login demos, and security checklists.', array['Python', 'OWASP', 'Linux'], 'shield'),
  ('internet-of-things', 'Internet of Things', 'Connect small devices and sensors so they can measure and share information.', 'Build room monitors, garden sensors, and simple smart-campus demos.', array['Arduino', 'ESP32', 'MQTT'], 'cpu'),
  ('data-analytics', 'Data Analytics', 'Organize information and use charts to answer practical questions.', 'Build dashboards for attendance, budgets, or community surveys.', array['SQL', 'Excel', 'Power BI'], 'chart')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  build_examples = excluded.build_examples,
  technologies = excluded.technologies,
  icon = excluded.icon;

insert into public.projects (
  category_id, slug, title, short_description, project_type, difficulty, technologies,
  overview, problem_solved, how_it_works, real_world_application, main_features,
  frontend_technologies, backend_technologies, database_technologies, other_tools,
  technology_explanations, learning_outcomes, suggested_duration
)
select
  c.id, p.slug, p.title, p.short_description, p.project_type, p.difficulty, p.technologies,
  p.overview, p.problem_solved, p.how_it_works, p.real_world_application, p.main_features,
  p.frontend_technologies, p.backend_technologies, p.database_technologies, p.other_tools,
  p.technology_explanations, p.learning_outcomes, p.suggested_duration
from (
  values
    ('web-development', 'online-learning-management-system', 'Online Learning Management System', 'A simple place where teachers share lessons and students track their learning.', 'Major', 'Intermediate', array['React', 'Node.js', 'PostgreSQL'], 'A learning website for organizing courses, lessons, and student progress.', 'Students can lose track of lesson files, assignments, and what they have completed.', 'Teachers add lessons and tasks. Students open course pages, submit work, and see their progress.', 'Schools, colleges, and training teams use learning portals to support classes online.', array['Course pages', 'Lesson and resource library', 'Assignment submission', 'Progress checklist'], array['React', 'CSS'], array['Node.js', 'Express'], array['PostgreSQL'], array['Git', 'REST API'], '{"React":"Builds the screens students click and read.","Node.js":"Runs the app logic on the server.","PostgreSQL":"Stores courses, lessons, and submissions.","REST API":"Lets the browser and server exchange information."}'::jsonb, array['Plan pages and user journeys','Connect a user interface to a server','Store related records in a database'], '8–12 weeks'),
    ('web-development', 'e-commerce-website', 'E-Commerce Website', 'A small online shop where people can browse products and place an order.', 'Major', 'Intermediate', array['React', 'Express', 'PostgreSQL'], 'An online storefront that presents products and records customer orders.', 'Small sellers need an organized way to show products and receive orders online.', 'Customers browse items, add them to a basket, and submit an order for the shop to review.', 'Independent shops and larger retailers use online stores to reach customers.', array['Product catalogue', 'Search and category filters', 'Shopping basket', 'Order summary'], array['React', 'CSS'], array['Node.js', 'Express'], array['PostgreSQL'], array['Git', 'REST API'], '{"React":"Displays product lists and shopping controls.","Express":"Receives requests and applies store rules.","PostgreSQL":"Keeps product and order records.","REST API":"Connects shop screens to server data."}'::jsonb, array['Model products and orders','Build searchable lists','Validate form input'], '8–12 weeks'),
    ('web-development', 'online-food-ordering-system', 'Online Food Ordering System', 'A menu site where customers choose meals and send an order to a restaurant.', 'Mini', 'Beginner', array['HTML', 'CSS', 'JavaScript', 'Node.js'], 'A restaurant menu and order form designed for a small campus café.', 'Calling or queuing to order can be inconvenient during busy breaks.', 'Customers read the menu, select dishes, and send an order for staff to prepare.', 'Cafés and restaurants use ordering tools to organize incoming requests.', array['Digital menu', 'Dish selection', 'Order total', 'Order confirmation screen'], array['HTML', 'CSS', 'JavaScript'], array['Node.js'], array['SQLite'], array['Git'], '{"HTML":"Gives the page its content and structure.","CSS":"Controls the page colors, spacing, and layout.","JavaScript":"Makes the menu respond to clicks.","SQLite":"Stores menu items and submitted orders."}'::jsonb, array['Create a responsive menu','Handle a simple order form','Calculate totals safely'], '3–5 weeks'),
    ('web-development', 'student-management-system', 'Student Management System', 'A staff tool for keeping student details and course records together.', 'Mini', 'Beginner', array['HTML', 'Bootstrap', 'Python', 'SQLite'], 'A small web app for adding, viewing, and updating student records.', 'Paper lists and scattered files are difficult to search and keep consistent.', 'A staff member enters a student record; the app validates it and saves it in a searchable list.', 'Schools and training centers use record systems to manage enrollment information.', array['Add and edit student records', 'Search by name or course', 'Course list', 'Required-field checks'], array['HTML', 'Bootstrap'], array['Python', 'Flask'], array['SQLite'], array['Git'], '{"Flask":"A small Python tool for building web routes.","Bootstrap":"Ready-made styles help pages adapt to screen sizes.","SQLite":"Stores student and course records in one file."}'::jsonb, array['Build create, read, update, and delete screens','Use form validation','Connect a server to stored records'], '4–6 weeks'),
    ('web-development', 'job-portal', 'Job Portal', 'A board where students can browse opportunities and save interesting roles.', 'Major', 'Intermediate', array['React', 'Node.js', 'PostgreSQL'], 'A focused job and internship listing site for a college community.', 'Students may miss opportunities when listings are spread across messages and noticeboards.', 'An administrator posts a role; students search listings and save the ones they want to revisit.', 'Universities and employers publish internships and entry-level roles on job boards.', array['Opportunity listings', 'Search by skill or location', 'Saved roles', 'Application information'], array['React', 'CSS'], array['Node.js', 'Express'], array['PostgreSQL'], array['Git', 'REST API'], '{"React":"Builds the searchable listings and saved list.","Node.js":"Runs the server-side listing rules.","PostgreSQL":"Stores roles and saved items.","REST API":"Moves listing data between screens and server."}'::jsonb, array['Design useful filters','Work with related database tables','Build a clear search experience'], '8–10 weeks'),
    ('web-development', 'hospital-management-system', 'Hospital Management System', 'A learning demo for organizing appointments and basic clinic information.', 'Major', 'Advanced', array['React', 'Node.js', 'PostgreSQL'], 'A student prototype that helps a small clinic organize appointments and departments.', 'Busy clinics need one clear view of appointments and service information.', 'Staff add appointment requests and mark their status; visitors can view clinic services.', 'Clinics use scheduling and information systems to coordinate patient visits. This student demo uses sample data only.', array['Appointment request form', 'Department information', 'Schedule view', 'Status updates'], array['React', 'CSS'], array['Node.js', 'Express'], array['PostgreSQL'], array['Git', 'REST API'], '{"React":"Shows the appointment and clinic screens.","Node.js":"Handles appointment rules on the server.","PostgreSQL":"Stores schedules and service information.","PostgreSQL note":"Use test data only; never store real patient records in a student demo."}'::jsonb, array['Plan privacy-aware data models','Build scheduling workflows','Validate user input'], '10–14 weeks'),
    ('web-development', 'online-quiz-platform', 'Online Quiz Platform', 'A quiz site that gives students quick feedback after they answer questions.', 'Basic', 'Beginner', array['HTML', 'CSS', 'JavaScript'], 'An interactive practice quiz for a course topic.', 'Students need a simple way to check what they understand before an exam.', 'The app presents questions, checks selected answers, and shows a score with explanations.', 'Teachers use practice quizzes to make revision more active.', array['Multiple-choice questions', 'Score summary', 'Answer explanations', 'Try again button'], array['HTML', 'CSS', 'JavaScript'], ARRAY[]::text[], ARRAY[]::text[], array['Git'], '{"HTML":"Holds questions and answer choices.","CSS":"Makes the quiz readable on different screens.","JavaScript":"Checks answers and updates the score."}'::jsonb, array['Use events and state','Write simple conditions','Give helpful feedback'], '2–4 weeks'),
    ('web-development', 'event-management-system', 'Event Management System', 'A site where a club can publish events and collect registrations.', 'Mini', 'Beginner', array['React', 'CSS', 'Supabase'], 'A small event directory with registration forms for student activities.', 'Students can miss events when details are posted in different places.', 'Organizers publish an event; students read the details and submit a registration.', 'Clubs and community groups use event pages to share schedules and manage sign-ups.', array['Event list', 'Date and venue details', 'Registration form', 'Capacity indicator'], array['React', 'CSS'], array['Supabase'], array['PostgreSQL'], array['Git'], '{"React":"Displays event cards and registration forms.","Supabase":"Provides a hosted database and server APIs.","PostgreSQL":"Stores event and registration details."}'::jsonb, array['Build reusable cards','Handle form state','Connect to a managed database'], '4–6 weeks'),
    ('web-development', 'personal-portfolio-website', 'Personal Portfolio Website', 'A personal site that introduces you and shows your best work.', 'Basic', 'Beginner', array['HTML', 'CSS', 'JavaScript'], 'A simple portfolio for presenting skills, projects, and contact details.', 'Students need a friendly way to show what they have learned and built.', 'Visitors read about the student, browse project summaries, and follow contact links.', 'Job applicants and freelancers use portfolios to make their work easy to review.', array['About section', 'Project gallery', 'Skills list', 'Contact links'], array['HTML', 'CSS', 'JavaScript'], ARRAY[]::text[], ARRAY[]::text[], array['Git', 'GitHub Pages'], '{"HTML":"Organizes headings, links, and project content.","CSS":"Creates the visual style and responsive layout.","Git":"Keeps a history of changes so you can safely improve the site."}'::jsonb, array['Structure a website','Present projects clearly','Publish a static site'], '1–3 weeks'),
    ('web-development', 'online-service-booking-platform', 'Online Service Booking Platform', 'A booking page where people request a time with a local service provider.', 'Mini', 'Intermediate', array['React', 'Express', 'PostgreSQL'], 'A scheduling tool for a small service such as tutoring or equipment repair.', 'Arranging appointments through repeated messages can cause missed details.', 'Customers choose a service and preferred time; the provider reviews and updates the request.', 'Tutors, repair shops, and local providers use booking systems to organize requests.', array['Service list', 'Preferred time request', 'Booking status', 'Contact information'], array['React', 'CSS'], array['Node.js', 'Express'], array['PostgreSQL'], array['Git', 'REST API'], '{"React":"Builds the service list and booking form.","Express":"Checks booking requests on the server.","PostgreSQL":"Stores service and booking records.","REST API":"Carries requests between browser and server."}'::jsonb, array['Model a booking lifecycle','Validate date and form inputs','Design useful status labels'], '5–7 weeks'),
    ('artificial-intelligence', 'study-topic-recommender', 'Study Topic Recommender', 'Suggests a revision topic based on the subjects a learner wants to practise.', 'Mini', 'Intermediate', array['Python', 'pandas', 'scikit-learn'], 'A small recommendation demo that groups learning topics by a student-selected interest.', 'Learners can feel unsure what related topic to explore next.', 'The app compares topic tags and suggests items with similar tags. It uses a small sample dataset.', 'Learning platforms recommend lessons based on a learner’s activity. This project is a transparent classroom prototype.', array['Topic selection', 'Related topic suggestions', 'Why this was suggested', 'Sample-data notice'], array['HTML', 'CSS'], array['Python', 'Flask'], array['SQLite'], array['pandas', 'scikit-learn'], '{"Python":"Runs the recommendation logic.","pandas":"Helps organize the sample topic table.","scikit-learn":"Provides tools for comparing and grouping examples.","SQLite":"Stores sample topics and selections."}'::jsonb, array['Prepare a small dataset','Compare simple features','Explain recommendations clearly'], '5–7 weeks'),
    ('python-development', 'file-organizer', 'Smart File Organizer', 'Sorts sample files into folders based on their file type.', 'Basic', 'Beginner', array['Python', 'pathlib'], 'A command-line helper that groups files in a chosen practice folder.', 'A folder with many mixed files can be difficult to browse.', 'The program checks each file extension and moves it into a matching folder after the user confirms.', 'People use small scripts to automate repetitive file tasks. Test only on copies of files.', array['Preview planned moves', 'Group by extension', 'Confirm before changes', 'Clear summary'], ARRAY[]::text[], array['Python'], ARRAY[]::text[], array['pathlib', 'Git'], '{"Python":"Reads the instructions and decides where files belong.","pathlib":"Lets the program work with file and folder paths safely.","Git":"Tracks code changes while you develop."}'::jsonb, array['Use loops and conditions','Work with file paths','Add a safe preview before changing files'], '1–2 weeks'),
    ('java-development', 'campus-library-system', 'Campus Library System', 'A simple catalogue for finding books and tracking loans in a class project.', 'Mini', 'Beginner', array['Java', 'Spring Boot', 'MySQL'], 'A learning app for organizing a library catalogue and sample loans.', 'A library needs a clear way to check whether a book is available.', 'Staff add books and loans; students search the catalogue and view availability.', 'Libraries use catalogue systems to help people find resources and track lending.', array['Book catalogue', 'Search by title', 'Loan record', 'Availability status'], array['HTML', 'CSS'], array['Java', 'Spring Boot'], array['MySQL'], array['Git', 'REST API'], '{"Java":"Contains the rules for books and loans.","Spring Boot":"Helps create server routes in Java.","MySQL":"Stores catalogue and loan records.","REST API":"Lets the interface request catalogue information."}'::jsonb, array['Create Java classes for real objects','Connect web routes to stored data','Use basic database relationships'], '5–7 weeks'),
    ('data-science', 'student-survey-explorer', 'Student Survey Explorer', 'Turns a small anonymous survey into charts that are easy to understand.', 'Mini', 'Beginner', array['Python', 'pandas', 'Jupyter'], 'A notebook that summarizes a practice student survey dataset.', 'Raw survey answers are difficult to compare by reading one row at a time.', 'The notebook cleans a sample dataset, calculates summaries, and draws charts.', 'Researchers and student groups explore survey results before making decisions. Use anonymous or sample data only.', array['Load a sample CSV', 'Check missing answers', 'Summarize responses', 'Create labeled charts'], ARRAY[]::text[], array['Python'], ARRAY[]::text[], array['pandas', 'Jupyter', 'matplotlib'], '{"Python":"Runs the analysis steps.","pandas":"Reads and organizes rows of survey data.","Jupyter":"Lets you combine code, charts, and explanations in one notebook.","matplotlib":"Draws charts from the summary."}'::jsonb, array['Clean a dataset','Choose a suitable chart','Explain a result without overstating it'], '3–5 weeks'),
    ('mobile-app-development', 'campus-event-companion', 'Campus Event Companion', 'A phone app concept for browsing campus events and saving favourites.', 'Mini', 'Intermediate', array['Flutter', 'Dart', 'Firebase'], 'A mobile-friendly event list that helps students keep track of activities.', 'Students may not remember event details shared in separate messages.', 'The app loads events, lets the student save favourites, and shows event time and location.', 'Schools use mobile event guides to help students find activities around campus.', array['Event feed', 'Favourite events', 'Date reminders', 'Location details'], array['Flutter', 'Dart'], array['Firebase'], array['Cloud Firestore'], array['Git'], '{"Flutter":"Builds screens that work on Android and iOS.","Dart":"The language used to write Flutter apps.","Firebase":"Provides hosted app services for a prototype.","Cloud Firestore":"Stores event details for the app."}'::jsonb, array['Build mobile layouts','Navigate between screens','Store simple user preferences'], '5–8 weeks'),
    ('cloud-computing', 'cloud-file-sharing-demo', 'Cloud File Sharing Demo', 'A safe classroom demo for uploading and sharing non-sensitive sample files.', 'Mini', 'Intermediate', array['Node.js', 'AWS S3', 'Docker'], 'A small service that stores sample files in cloud object storage.', 'Files kept on one computer are difficult to share with a group.', 'The app accepts a sample file and stores it in a private test bucket with a short-lived access link.', 'Teams use cloud storage to share files. Never upload personal or confidential information to a student demo.', array['Sample upload', 'Private object storage', 'Temporary share link', 'File size checks'], array['HTML', 'CSS'], array['Node.js'], array['AWS S3'], array['Docker', 'AWS SDK'], '{"Node.js":"Runs the upload service.","AWS S3":"Stores file objects in a cloud bucket.","Docker":"Packages the app so it runs consistently.","AWS SDK":"Lets the server talk to cloud storage."}'::jsonb, array['Understand cloud storage','Keep credentials on the server','Validate uploads and access'], '5–7 weeks'),
    ('cybersecurity', 'password-strength-learning-tool', 'Password Strength Learning Tool', 'Shows why a sample password may be easy or hard to guess.', 'Basic', 'Beginner', array['Python', 'Flask', 'OWASP'], 'An educational checker that evaluates password patterns locally and never stores input.', 'People may reuse short or predictable passwords without understanding the risk.', 'The tool checks length and common patterns, then explains safer choices. It does not send or save the typed password.', 'Security education helps people make better account choices. This tool is a classroom learning aid, not an audit service.', array['Local-only sample input', 'Length feedback', 'Common-pattern warning', 'Safer password tips'], array['HTML', 'CSS'], array['Python', 'Flask'], ARRAY[]::text[], array['OWASP guidance'], '{"Python":"Checks the example input using clear rules.","Flask":"Serves the small educational page.","OWASP guidance":"Offers trusted general application-security advice."}'::jsonb, array['Explain basic password risks','Avoid saving sensitive input','Write clear security feedback'], '2–3 weeks'),
    ('internet-of-things', 'smart-room-environment-monitor', 'Smart Room Environment Monitor', 'Reads a room sensor and displays sample temperature or humidity values.', 'Mini', 'Intermediate', array['ESP32', 'Arduino', 'MQTT'], 'A small hardware demo that sends sensor readings to a simple monitor.', 'It can be useful to notice changes in a room without checking a sensor by hand.', 'An ESP32 reads a sensor and sends values over Wi-Fi to a local or test dashboard.', 'Connected sensors monitor spaces such as classrooms, greenhouses, and labs.', array['Sensor reading', 'Timestamped values', 'Simple status display', 'Disconnect notice'], array['HTML', 'CSS', 'JavaScript'], array['Arduino C++'], ARRAY[]::text[], array['ESP32', 'MQTT'], '{"ESP32":"A small board that can read sensors and connect to Wi-Fi.","Arduino C++":"Code that tells the board what to do.","MQTT":"A lightweight way for devices to send messages."}'::jsonb, array['Read a basic sensor','Send a small message','Show when a device is offline'], '4–6 weeks'),
    ('data-analytics', 'campus-attendance-insights', 'Campus Attendance Insights', 'Summarizes sample attendance records to show class patterns.', 'Mini', 'Beginner', array['SQL', 'Excel', 'Power BI'], 'A small reporting project using fictional classroom attendance data.', 'A long list of records can hide simple patterns such as busy days or missing entries.', 'Students clean a sample spreadsheet, query totals, and build a few labeled charts.', 'Schools use reports to understand participation. Use sample data and avoid identifying real students.', array['Clean sample records', 'Attendance summaries', 'Day-by-day chart', 'Data quality notes'], array['Power BI'], ARRAY[]::text[], array['PostgreSQL'], array['SQL', 'Excel'], '{"SQL":"Asks clear questions of tables of data.","Excel":"Helps inspect and clean small spreadsheets.","Power BI":"Turns cleaned data into interactive charts.","PostgreSQL":"Stores the practice attendance table."}'::jsonb, array['Write simple queries','Check data quality','Choose charts that answer a question'], '3–5 weeks')
) as p(
  category_slug, slug, title, short_description, project_type, difficulty, technologies,
  overview, problem_solved, how_it_works, real_world_application, main_features,
  frontend_technologies, backend_technologies, database_technologies, other_tools,
  technology_explanations, learning_outcomes, suggested_duration
)
join public.project_categories c on c.slug = p.category_slug
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
