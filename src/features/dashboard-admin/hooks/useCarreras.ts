import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAdminCarreras, 
  createCarrera, 
  updateCarrera, 
  deleteCarrera 
} from '@/src/services/api/admin';
import { CreateCarreraDto, UpdateCarreraDto } from '@/src/types/admin';
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
      toast.success('Carrera creada exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al crear carrera: ' + (error.response?.data?.message || error.message));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCarreraDto }) => updateCarrera(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carreras'] });
      toast.success('Carrera actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al actualizar carrera: ' + (error.response?.data?.message || error.message));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCarrera(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carreras'] });
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
