import { useApi } from './useApi';

export const useMovements = () => {
  const { fetchData, uploadFile } = useApi();
  
  const fetchMovement = async (id) => {
    try {
      const response = await fetchData(`/mov/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error fetching movement:', error);
      return { data: null, error };
    }
  };

  const fetchAllMovements = async () => {
    try {
      const response = await fetchData('/mov');
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error fetching movements:', error);
      return { data: null, error };
    }
  };

  const updateMovementStatus = async (id, status) => {
    try {
      const response = await fetchData(`/mov/status/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ WorkflowStatus: status })
      });
      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating movement status:', error);
      return { success: false, error };
    }
  };

  const handleFileUpload = async (file, movementId) => {
    try {
      // Upload file
      const uploadResponse = await uploadFile(file);
      if (!uploadResponse.ok) throw new Error('Error uploading file');
      
      const uploadedFile = uploadResponse.data;

      // Validate bank type and poder
      if (uploadedFile.bankType !== 'BBVABAJA') {
        throw new Error('El tipo de banco debe ser BBVABAJA');
      }

      if (uploadedFile.poder !== '100%') {
        throw new Error('El poder debe ser 50%');
      }

      // Save file info
      const fileResponse = await fetchData('/files', {
        method: 'POST',
        body: JSON.stringify({
          movementId,
          FileName: uploadedFile.filename,
          FileUrl: uploadedFile.url,
          bankType: uploadedFile.bankType,
          cuentaAbono: uploadedFile.cuentaAbono,
          cuentaCargo: uploadedFile.cuentaCargo,
          importeOperacion: uploadedFile.importeOperacion,
          fechaAplicacion: uploadedFile.fechaAplicacion,
          Status: 0,
          Stage: 3,
          CreatedBy: process.client ? localStorage.username : '999'
        })
      });

      return { data: uploadedFile, error: null };
    } catch (error) {
      console.error('Error in file upload process:', error);
      return { data: null, error };
    }
  };

  const fetchClarifications = async () => {
    try {
      const response = await fetchData('/cfs');
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error fetching clarifications:', error);
      return { data: null, error };
    }
  };

  return {
    fetchMovement,
    fetchAllMovements,
    updateMovementStatus,
    handleFileUpload,
    fetchClarifications
  };
};