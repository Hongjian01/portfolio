import type { Experience, PortfolioData, Profile, Project, SocialLink } from '../types'

export const PROFILE: Profile = {
  name: '李雪庚',
  title: '中国海洋大学 | 计算机技术专业 | 2027届研究生',
  statement:
    '研究方向:时间敏感网络(TSN) | 一枚努力寻找暑期实习的Java菜鸟~',
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'backend-intern-2025',
    period: '2025.07 - 2025.12',
    role: '后端开发实习生',
    company: '某互联网基础架构团队',
    description:
      '参与订单与风控链路的服务化改造，负责核心 Java 服务接口设计与性能调优。围绕秒级流量峰值场景引入 Kafka 异步削峰与 Redis 多级缓存策略，完成热点 Key 拆分、消费幂等与重试补偿机制，支撑高并发活动期间的稳定吞吐并降低接口超时率。',
    techStack: [
      'Java',
      'Spring Boot',
      'Kafka',
      'Redis',
      'MySQL',
      'Docker',
      'Prometheus',
      'Grafana',
    ],
  },
  {
    id: 'distributed-lab-2024',
    period: '2024.09 - 2025.06',
    role: '分布式系统方向研究助理',
    company: '高校实验室（系统与网络组）',
    description:
      '参与分布式调度与一致性机制课题，负责服务节点时序对齐、日志追踪与压测平台搭建。通过自研压测脚本复现网络抖动与时钟漂移场景，分析跨节点时间误差对任务编排与事件顺序的影响，沉淀了可复用的实验流程与指标面板。',
    techStack: ['Java', 'gRPC', 'etcd', 'Redis', 'Linux', 'Python', 'InfluxDB'],
  },
  {
    id: 'graduate-engineering-2023',
    period: '2023.09 - 至今',
    role: '计算机硕士研究生（2027届）',
    company: '某高校计算机学院',
    description:
      '主攻 Java 后端开发与分布式系统工程，系统学习并实践高并发服务治理、消息队列架构设计、缓存一致性与数据库优化。课程与课题中持续聚焦“性能-可靠性-可维护性”平衡，形成从问题建模到工程交付的完整技术闭环。',
    techStack: ['Java', 'Spring Cloud', 'Kafka', 'Redis', 'MySQL', 'Nginx', 'Git'],
  },
]

export const PROJECTS: Project[] = [
  {
    id: 'flash-sale-platform',
    period: '2025.03 - 2025.06',
    title: '高并发秒杀交易平台（分布式后端）',
    description:
      '面向突发流量场景设计分层限流与异步化链路，采用 Kafka 进行削峰填谷，结合 Redis 预扣库存与 Lua 原子脚本保障并发一致性。通过消费者幂等校验、延迟队列补偿与链路监控报警，实现高峰时段的稳定处理与故障快速定位。',
    tags: [
      'Java',
      'Spring Boot',
      'Kafka',
      'Redis',
      'Lua',
      'MySQL',
      'Sentinel',
      'ELK',
    ],
    link: 'https://github.com/example/high-concurrency-seckill',
  },
  {
    id: 'tsn-clock-sync',
    period: '2024.11 - 2025.04',
    title: 'TSN时钟同步算法优化与仿真验证',
    description:
      '围绕时间敏感网络（TSN）中的时钟同步精度问题，构建仿真数据集并实现漂移补偿策略。通过对比不同网络时延与抖动条件下的同步误差分布，优化参数更新策略，提升复杂网络拓扑中的时间对齐稳定性，为工业实时通信场景提供算法参考。',
    tags: ['TSN', 'Clock Synchronization', 'Python', 'MATLAB', 'Linux', '数据分析'],
    link: 'https://github.com/example/tsn-clock-sync-research',
  },
  {
    id: 'observability-platform',
    period: '2024.05 - 2024.09',
    title: '分布式服务可观测性看板',
    description:
      '为多服务后端构建日志、指标、追踪三位一体的可观测性方案，聚合接口延迟、消息堆积、缓存命中与异常率等核心指标。针对 Kafka 消费延迟和 Redis 热点问题设计告警阈值与排障手册，显著提升线上问题发现与恢复效率。',
    tags: ['Prometheus', 'Grafana', 'ELK', 'Kafka', 'Redis', 'OpenTelemetry', 'Docker'],
    link: 'https://github.com/example/distributed-observability-dashboard',
  },
]

export const SOCIALS: SocialLink[] = [
  {
    id: '1',
    platform: 'GitHub',
    url: 'https://github.com/yourname',
    iconName: 'Code2',
  },
  {
    id: '2',
    platform: 'Email',
    url: 'mailto:your@email.com',
    iconName: 'Mail',
  },
]

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  about:
    '专注于构建确定性网络与高性能架构，追求像素级的代码质量。我对底层原理（网络协议、并发控制、内存管理）始终保持敬畏与好奇。在屏幕之外，我热爱水族微距摄影，这种在镜头前捕捉微小细节时所需的绝对专注，同样贯穿于我对分布式系统死锁排查与性能调优的日常代码实践中。',
  aboutKeywords: [
    '确定性网络',
    '高性能架构',
    '网络协议',
    '并发控制',
    '内存管理',
    '分布式系统',
    '性能调优',
  ],
  profile: PROFILE,
  socials: SOCIALS,
  experiences: EXPERIENCES,
  projects: PROJECTS,
}

export function getInitialPortfolioData(): PortfolioData {
  return JSON.parse(JSON.stringify(INITIAL_PORTFOLIO_DATA)) as PortfolioData
}
