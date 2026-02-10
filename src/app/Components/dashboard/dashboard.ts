import { Component, signal } from '@angular/core';
import { StudentService } from '../../services/student-service';
import { TeacherService } from '../../services/teacher-service';
import { WorkerService } from '../../services/worker-service';
import { computed } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard',
  imports: [
    ChartModule,
    FormsModule,
    CommonModule,
    NgxEchartsModule
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts }
    }
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  students = computed(() => this.studentService.students());

  isDarkMode = signal(false);

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private workerService: WorkerService
  ) { }

  ngOnInit(): void {
    this.studentService.loadStudents();
  }

  // Summary Cards using signals

  studentGrowthPercent = computed(() => {
    const students = this.studentService.students();
    if (students.length === 0) return 0;

    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const currentCount = students.filter(s => {
      const d = new Date(s.enrollmentDate);
      return !isNaN(d.getTime()) && d.getFullYear() === currentYear;
    }).length;

    const previousCount = students.filter(s => {
      const d = new Date(s.enrollmentDate);
      return !isNaN(d.getTime()) && d.getFullYear() === lastYear;
    }).length;

    if (previousCount === 0)
      return currentCount > 0 ? 100 : 0;

    return Math.round(((currentCount - previousCount) / previousCount) * 100);
  });

  /* totals */
  totalStudents = computed(() => this.studentService.students().length);
  totalTeachers = computed(() => this.teacherService.teachers().length);
  totalWorkers = computed(() => this.workerService.worker().length);

  activeStudents = computed(() => this.totalStudents());
  graduatedStudents = computed(() => this.totalStudents());

  totalStaff = computed(() => this.totalTeachers() + this.totalWorkers());

  teacherSharePercent = computed(() => {
    const staff = this.totalStaff();
    return staff === 0 ? 0 : Math.round((this.totalTeachers() / staff) * 100);
  });

  workerSharePercent = computed(() => {
    const staff = this.totalStaff();
    return staff === 0 ? 0 : Math.round((this.totalWorkers() / staff) * 100);
  });

  academicYear = '2025–2026';
  currentSemester = 'Spring';

  // Chart Data
  private chartColors = computed(() => {
    return this.isDarkMode()
      ? { text: '#f8fafc', grid: 'rgba(255, 255, 255, 0.1)', border: '#475569' }
      : { text: '#64748b', grid: 'rgba(0, 0, 0, 0.05)', border: '#e2e8f0' };
  });

  enrollmentOption = computed(() => {
    const students = this.students();

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const counts = months.map((_, i) =>
      students.filter(s => {
        if (!s.enrollmentDate) return false;
        const d = new Date(s.enrollmentDate);
        return !isNaN(d.getTime()) && d.getMonth() === i;
      }).length
    );

    const colors = this.chartColors();

    return {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: { color: colors.text }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: colors.text },
        splitLine: { lineStyle: { color: colors.grid } }
      },
      series: [
        {
          name: 'Enrollment',
          type: 'line',
          data: counts,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#3b82f6', width: 3 },
          itemStyle: { color: '#3b82f6' }
        }
      ]
    };
  });



  // BAR CHART DATA- students by course
  studentsByCourseData = computed(() => {
    const students = this.studentService.students();
    const courseMap: Record<string, number> = {};

    students.forEach(s => {
      courseMap[s.course] = (courseMap[s.course] || 0) + 1;
    });

    return {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: Object.keys(courseMap),
        axisLabel: {
          interval: 0,
        }
      },
      yAxis: {
        type: 'value',
        max: 10,
      },
      series: [
        {
          name: 'Students',
          type: 'bar',
          data: Object.values(courseMap),
          barWidth: '40%',
          itemStyle: {
            color: '#3b82f6'
          }
        }
      ]
    };
  });


  // PIE CHART - Students by Year
  studentsByYearOption = computed(() => {
    const students = this.studentService.students();

    const year1 = students.filter(s => s.year === 1).length;
    const year2 = students.filter(s => s.year === 2).length;
    const year3 = students.filter(s => s.year === 3).length;
    const year4 = students.filter(s => s.year === 4).length;

    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '0'
      },
      color: ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'],

      series: [
        {
          name: 'Students by Year',
          type: 'pie',
          radius: '60%',
          data: [
            { value: year1, name: 'Year 1' },
            { value: year2, name: 'Year 2' },
            { value: year3, name: 'Year 3' },
            { value: year4, name: 'Year 4' }
          ],
          label: {
            show: true,
            fontSize: 12,     
            color: 'grey'               
          },
          labelLine: {
            lineStyle: {
              width: 2
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0
            }
          }
        }
      ],
    };
  });


  // Vertical bar
  courseOverviewOption = computed(() => {
    const teachers = this.teacherService.teachers();
    const students = this.studentService.students();

    // Get unique courses from students
    const courses = Array.from(
      new Set(students.map(s => s.course))
    );

    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        bottom: '0',
        data: ['Students']
      },

      color: ['#3b82f6'],

      xAxis: {
        type: 'category',
        data: courses,
        axisLabel: {
          interval: 0,
        }
      },
      yAxis: {
        type: 'value',
        max: 10,
      },
      series: [
        {
          name: 'Students',
          type: 'bar',
          data: courses.map(
            c => students.filter(s => s.course === c).length
          )
        }
      ]
    };
  });

  // Quick stats Summary

  // Average Students per Teacher
  averageStudentsPerTeacher = computed(() => {
    const students = this.totalStudents();
    const teachers = this.totalTeachers();

    if (teachers === 0) return 0;
    return +(students / teachers).toFixed(2);
  });

  // Students Retention rate
  studentRetentionRate = computed(() => {
    const total = this.totalStudents();
    if (total === 0) return 0;

    // Using total students as retention rate
    return Math.round((total / total) * 100);
  });

  // Staff to student Ratio
  workerToStudentRatio = computed(() => {
    const workers = this.totalWorkers();
    const students = this.totalStudents();

    if (workers === 0 || students === 0) {
      return '0:0';
    }

    const ratio = (workers / students).toFixed(2);
    return `${ratio}:1`;
  });

}