import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAlertCatalog, 
  createAlertTag, 
  updateAlertTag, 
  deleteAlertTag 
} from '@/src/services/api/admin';
import { CreateAlertCatalogDto, UpdateAlertCatalogDto } from '@/src/types/admin';
import { toast } from 'sonner';

/**
 * @module useAlertCatalog
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU016 — Configuración del catálogo de alertas
 * @api GET /api/alert-catalog, POST /api/alert-catalog, PATCH /api/alert-catalog/:id, DELETE /api/alert-catalog/:id
 */
export const useAlertCatalog = () => {
  const queryClient = useQueryClient();

  const alertsQuery = useQuery({
    queryKey: ['alert-catalog'],
    queryFn: () => getAlertCatalog(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAlertCatalogDto) => createAlertTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-catalog'] });
      toast.success('Etiqueta de alerta creada exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al crear etiqueta: ' + (error.response?.data?.message || error.message));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAlertCatalogDto }) => updateAlertTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-catalog'] });
      toast.success('Etiqueta de alerta actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al actualizar etiqueta: ' + (error.response?.data?.message || error.message));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAlertTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-catalog'] });
      toast.success('Etiqueta de alerta eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al eliminar etiqueta: ' + (error.response?.data?.message || error.message));
    }
  });

  return {
    alertas: alertsQuery.data || [],
    isLoading: alertsQuery.isLoading,
    isError: alertsQuery.isError,
    error: alertsQuery.error,
    createAlerta: createMutation.mutateAsync,
    updateAlerta: updateMutation.mutateAsync,
    deleteAlerta: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
