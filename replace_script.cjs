const fs = require('fs');
let code = fs.readFileSync('src/pages/startup/DiscoverStudents.jsx', 'utf-8');

code = code.replace(/BrowseProjects/g, 'DiscoverStudents');
code = code.replace(/\/projects/g, '/profile/students');
code = code.replace(/\/ai\/recommend/g, '/ai/recommend-students');
code = code.replace(/setProjects/g, 'setStudents');
code = code.replace(/const \[projects,/g, 'const [students,');
code = code.replace(/loadProjects/g, 'loadStudents');
code = code.replace(/filteredProjects/g, 'filteredStudents');
code = code.replace(/Browse Innovation/g, 'Discover Talent');
code = code.replace(/Discover top-tier academic projects/g, 'Discover top-tier student talent');
code = code.replace(/Search projects, domains/g, 'Search skills, degrees, or roles');
code = code.replace(/Filter By Category/g, 'Filter By Background');
code = code.replace(/Filter By Sector/g, 'Filter By Degree');
code = code.replace(/All Sectors/g, 'All Degrees');
code = code.replace(/ProjectCardSkeleton/g, 'DashboardSkeleton');
code = code.replace(/No projects found/g, 'No students found');
code = code.replace(/filteredStudents\.map\(\(project/g, 'filteredStudents.map((student');
code = code.replace(/project\.id \|\| project\._id/g, 'student._id');
code = code.replace(/project\./g, 'student.');
code = code.replace(/student\.title/g, 'student.name');
code = code.replace(/student\.description/g, '(student.profileDetails?.description || "No description provided.")');
code = code.replace(/student\.domain/g, '(student.profileDetails?.academicBackground || "Various")');
code = code.replace(/\/student\/project\/\$\{createSlug\(student\.name, student\._id\)\}/g, '#');
code = code.replace(/View Opportunity/g, 'View Profile');
// Change the import of skeleton
code = code.replace(/import \{ ProjectCardSkeleton \} from '\.\.\/\.\.\/components\/shared\/SkeletonLoader'/g, 'import { DashboardSkeleton as ProjectCardSkeleton } from \'../../components/shared/SkeletonLoader\'');

fs.writeFileSync('src/pages/startup/DiscoverStudents.jsx', code);
console.log('Successfully replaced file contents!');
