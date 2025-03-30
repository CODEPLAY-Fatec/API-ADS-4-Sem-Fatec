import { useState, useEffect } from 'react';
import { Card, Text, Flex, Box } from '@radix-ui/themes';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';

interface Project {
  id: number;
  name: string;
  description: string | null;
  subject: string | null;
  institution: string | null;
  creator: number;
  status: string;
}

const Tabela = ({ projectId }: { projectId: number }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar projeto');
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <Card>
        <Skeleton height={30} count={4} />
      </Card>
    );
  }

  if (!project) {
    return <Text>Projeto não encontrado.</Text>;
  }

  return (
    <Card>
      <Text as="h2" size="4" weight="bold">
        {project.name}
      </Text>
      <Text as="p" color="gray" mt="2">
        {project.description || 'Sem descrição disponível.'}
      </Text>
      <Flex gap="3" mt="4">
        <Box>
          <Text size="2" color="gray">
            Status
          </Text>
          <Text>{project.status}</Text>
        </Box>
        <Box>
          <Text size="2" color="gray">
            Assunto
          </Text>
          <Text>{project.subject || 'Não especificado'}</Text>
        </Box>
        <Box>
          <Text size="2" color="gray">
            Instituição
          </Text>
          <Text>{project.institution || 'Não especificada'}</Text>
        </Box>
        <Box>
          <Text size="2" color="gray">
            Criador
          </Text>
          <Text>{project.creator}</Text>
        </Box>
      </Flex>
    </Card>
  );
};

export default Tabela;