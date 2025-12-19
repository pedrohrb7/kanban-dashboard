import { useEffect } from 'react';
import { Card, Col, Row, Statistic, Typography, Progress, Spin } from 'antd';
import {
  TickCircle,
  Clock,
  InfoCircle,
  Task as TaskIcon,
  TrendUp,
} from 'iconsax-reactjs';
import { useQuery } from '@tanstack/react-query';

import {
  TASK_ACTION_KEY,
  KanbanActions,
} from '../../modules/kanban/actions/KanbanActions';
import { DashboardUtils } from '../../modules/dashboard/utils/dashboard-utils';
import { TaskStorage } from '../../modules/kanban/utils/task-utils';

const { Title } = Typography;

const DashboardPage = () => {
  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [TASK_ACTION_KEY.FIND_ALL],
    queryFn: () => {
      const storedTasks = TaskStorage.getTasks();
      if (storedTasks) {
        return Promise.resolve(storedTasks);
      }
      return KanbanActions.findAllTasks();
    },
  });

  useEffect(() => {
    const handleStorageChange = () => {
      refetch();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refetch]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        <Spin size="large" />
      </div>
    );
  }

  const statusCount = DashboardUtils.getTaskCountByStatus(tasks);
  const completedTodayPct = DashboardUtils.getCompletedTodayPercentage(tasks);
  const completedWeekPct =
    DashboardUtils.getCompletedThisWeekPercentage(tasks);
  const avgCompletionTime = DashboardUtils.getAverageCompletionTime(tasks);
  const productivity = DashboardUtils.getProductivityMetrics(tasks);

  return (
    <div>
      <Title level={2}>Dashboard</Title>

      {/* Task Count by Status */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="A Fazer"
              value={statusCount.todo}
              valueStyle={{ color: '#94C6FF' }}
              prefix={<TaskIcon size={24} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Em Progresso"
              value={statusCount.inProgress}
              valueStyle={{ color: '#FFBE4F' }}
              prefix={<Clock size={24} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Atrasado"
              value={statusCount.overdue}
              valueStyle={{ color: '#E86F6F' }}
              prefix={<InfoCircle size={24} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Concluído"
              value={statusCount.done}
              valueStyle={{ color: '#54DEB0' }}
              prefix={<TickCircle size={24} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Completion Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={8}>
          <Card title="Concluídas Hoje">
            <Statistic
              value={completedTodayPct.toFixed(1)}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
            <Progress
              percent={completedTodayPct}
              strokeColor="#52c41a"
              showInfo={false}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              {tasks.filter(t => {
                if (!t.completedAt) return false;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const completedDate = new Date(t.completedAt);
                completedDate.setHours(0, 0, 0, 0);
                return completedDate.getTime() === today.getTime();
              }).length}{' '}
              de {statusCount.total} tarefas
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Concluídas Esta Semana">
            <Statistic
              value={completedWeekPct.toFixed(1)}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress
              percent={completedWeekPct}
              strokeColor="#1890ff"
              showInfo={false}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              {tasks.filter(t => {
                if (!t.completedAt) return false;
                const now = new Date();
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                const completedDate = new Date(t.completedAt);
                return completedDate >= startOfWeek;
              }).length}{' '}
              de {statusCount.total} tarefas
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title="Tempo Médio de Conclusão"
            extra={<TrendUp size={20} color="#ff4d4f" />}>
            <Statistic
              value={avgCompletionTime}
              precision={1}
              suffix="dias"
              valueStyle={{ color: '#cf1322' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              Baseado em {statusCount.done} tarefas concluídas
            </div>
          </Card>
        </Col>
      </Row>

      {/* Productivity Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Produtividade">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}>
                    <span>Entregues no Prazo</span>
                    <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
                      {productivity.onTime} tarefas
                    </span>
                  </div>
                  <Progress
                    percent={productivity.onTimePercentage}
                    strokeColor="#52c41a"
                  />
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}>
                    <span>Entregues com Atraso</span>
                    <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
                      {productivity.late} tarefas
                    </span>
                  </div>
                  <Progress
                    percent={
                      productivity.total > 0
                        ? (productivity.late / productivity.total) * 100
                        : 0
                    }
                    strokeColor="#ff4d4f"
                  />
                </div>
              </Col>
            </Row>

            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
              }}>
              <strong>Total de Tarefas Concluídas:</strong>{' '}
              {productivity.total}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
