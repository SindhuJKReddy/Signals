import { Component, signal } from '@angular/core';
import { StudentService } from '../../services/student-service';
import { TeacherService } from '../../services/teacher-service';
import { WorkerService } from '../../services/worker-service';
import { computed } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [
    ChartModule,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  constructor(
    
    private studentService: StudentService,
    private teacherService: TeacherService,
    private workerService: WorkerService
  ) { }

  // Summary Cards using signals
  totalStudents = computed(() => this.studentService.students().length);

  activeStudents = computed(() =>
    this.studentService.students().filter(s => s.status === 'Active').length
  );

  graduatedStudents = computed(() =>
    this.studentService.students().filter(s => s.status === 'Graduated').length
  );

  totalTeachers = computed(() => this.teacherService.teachers().length);

  totalWorkers = computed(() => this.workerService.worker().length);

  academicYear = '2025–2026';
  currentSemester = 'Spring';

  studentGrowth = signal(12);

  // Chart Data
  enrollmentData = computed(() => {
  const students = this.studentService.students();

  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const monthMap: Record<string, number> = {};

  students.forEach(s => {
    const month = new Date(s.enrollment)
      .toLocaleString('default', { month: 'short' });

    monthMap[month] = (monthMap[month] || 0) + 1;
  });

  const labels = monthOrder.filter(m => monthMap[m] !== undefined);
  const data = labels.map(m => monthMap[m]);

  return {
    labels,
    datasets: [
      {
        label: 'Students',
        data,
        fill: false,
        tension: 0.4
      }
    ]
  };
});

  // Chart Options tells the chart how to behave; responsive: true makes it adapt to screen size; legend is a small box on the top of the chart which tells what each color represents
  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      }
    },
    scales: {
      y: {
        max: 10,
        beginAtZero: true,
        ticks: {
      stepSize: 1
    }
      }
    }
  };

  // BAR CHART DATA- students by grade
  studentsByGradeData = computed(() => {
  const students = this.studentService.students();
  const gradeMap: Record<string, number> = {};

  students.forEach(s => {
    gradeMap[s.grade] = (gradeMap[s.grade] || 0) + 1;
  });

  return {
    labels: Object.keys(gradeMap),
    datasets: [
      {
        label: 'Students',
        data: Object.values(gradeMap),
        backgroundColor: '#3b82f6',
        borderRadius: 8
      }
    ]
  };
});

  studentsByGradeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      },

    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        max: 50,
        beginAtZero: true,
        ticks: {
          stepSize: 10
        }
      }
    }
  };

  // PIE CHART
  studentStatusDistribution = computed(() => {
  const students = this.studentService.students();

  const active = students.filter(s => s.status === 'Active').length;
  const inactive = students.filter(s => s.status === 'Inactive').length;
  const graduated = students.filter(s => s.status === 'Graduated').length;

  return {
    labels: ['Active', 'Inactive', 'Graduated'],
    datasets: [
      {
        data: [active, inactive, graduated],
        backgroundColor: ['#10b981', '#ef4444', '#3b82f6'],
        borderWidth: 1
      }
    ]
  };
});

  studentStatusOptions = {
    plugins: {
      legend: {     
        labels: {
          usePointStyle: true,
          color: 'Grey',
        }
      }
    }
  }

  // Vertical bar

  departmentOverview = computed(() => {

    
  const teachers = this.teacherService.teachers();
  const students = this.studentService.students();
 
  // Combine departments from BOTH teachers & students
  const departments = Array.from(
    new Set([
      ...teachers.map(t => t.department),
      ...students.map(s => s.department)
    ])
  );
 
  return {
    labels: departments,
    datasets: [
      {
        label: 'Teachers',
        data: departments.map(
          d => teachers.filter(t => t.department === d).length
        ),
        backgroundColor: '#10b981',
        borderRadius: 8,
      },
      {
        label: 'Students',
        data: departments.map(
          d => students.filter(s => s.department === d).length
        ),
        backgroundColor: '#3b82f6',
        borderRadius: 8,
      }
    ]
  };
});

            departmentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#334155',
          font: {
            weight: '500'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (items: any[]) => items[0].label,
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#64748b',
         
        },
        grid: {
          drawBorder: false,
          color: '#e5e7eb'
        }
      },
      y: {
        min: 0,
        max: 10,
        beginAtZero: true,
        ticks: {
          color: '#64748b',
          stepSize: 2
        },
        grid: {
          drawBorder: false,
          color: '#e5e7eb'
        }
      }
    }
  };
 

// Quick stats Summary

// Average Students per Teacher

averageStudentsPerTeacher = computed(() => {
  const students = this.totalStudents();
  const teachers = this.totalTeachers();

  if( teachers === 0 ) return 0;
  return +(students / teachers).toFixed(2);
});

// Students Retention rate

studentRetentionRate = computed(() => {
  const total = this.totalStudents();
  if ( total === 0 ) return 0;

  const retained = 
  this.activeStudents();

  return Math.round( (retained / total) * 100 )
});

// Staff to student Ratio
workerToTeacherRatio = computed(() => {
  const teachers = this.totalTeachers();
  const workers = this.totalWorkers();

  if (teachers === 0 || workers === 0) {
    return '0:0';
  }

  // helper function to find GCD
  const gcd = (a: number, b: number): number =>
    b === 0 ? a : gcd(b, a % b);

  const divisor = gcd(workers, teachers);

  const staffRatio = workers / divisor;
  const teacherRatio = teachers / divisor;

  return `${staffRatio}:${teacherRatio}`;
});


}