import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAdminCarreras, 
  createCarrera, 
  updateCarrera, 
  deleteCarrera 
} from '@/src/services/api/admin';
import { CreateCarreraDto, UpdateCarreraDto, Carrera } from '@/src/types/admin';
import { toast } from 'sonner';

/**
 * @module useCarreras
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU-ADMIN-CARRERAS
 * @api GET /api/carreras, POST /api/carreras, PATCH /api/carreras/:id, DELETE /api/carreras/:id
 */
export const useCarreras = () => {
  const queryClient = useQueryClient();

  const carrerasQuery = useQuery({
    queryKey: ['carreras'],
    queryFn: () => getAdminCarreras(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCarreraDto) => createCarrera(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carreras'] });
      queryClient.invalidateQueries({ queryKey: ['admin-kpis'] });
      toast.success('Carrera creada exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al crear carrera: ' + (error.response?.data?.message || error.message));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCarreraDto }) => updateCarrera(id, data),
    onMutate: async ({ id, data }) => {
      // Cancelar cualquier refetch pendiente para evitar sobrescribir la actualización optimista
      await queryClient.cancelQueries({ queryKey: ['carreras'] });

      // Guardar el estado previo para rollback
      const previousCarreras = queryClient.getQueryData<Carrera[]>(['carreras']);

      // Actualización optimista: aplicar el cambio de inmediato en la UI
      queryClient.setQueryData<Carrera[]>(['carreras'], (old) =>
        old?.map((c) => (c.id === id ? { ...c, ...data } : c)) ?? []
      );

      return { previousCarreras };
    },
    onError: (error: any, _variables, context) => {
      // Rollback al estado previo si la mutación falla
      if (context?.previousCarreras) {
        queryClient.setQueryData(['carreras'], context.previousCarreras);
      }
      toast.error('Error al actualizar carrera: ' + (error.response?.data?.message || error.message));
    },
    onSettled: () => {
      // Siempre re-sincronizar con el servidor después de la mutación
      queryClient.invalidateQueries({ queryKey: ['carreras'] });
      queryClient.invalidateQueries({ queryKey: ['admin-kpis'] });
    },
    onSuccess: () => {
      toast.success('Carrera actualizada exitosamente');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCarrera(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carreras'] });
      queryClient.invalidateQueries({ queryKey: ['admin-kpis'] });
      toast.success('Carrera eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al eliminar carrera: ' + (error.response?.data?.message || error.message));
    }
  });

  return {
    carreras: carrerasQuery.data || [],
    isLoading: carrerasQuery.isLoading,
    isError: carrerasQuery.isError,
    error: carrerasQuery.error,
    createCarrera: createMutation.mutateAsync,
    updateCarrera: updateMutation.mutateAsync,
    deleteCarrera: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
