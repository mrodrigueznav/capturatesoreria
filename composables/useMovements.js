export const useMovements = () => {
  const API_BASE = 'http://localhost:3001/api/v1'
  
  const endpoints = {
    movements: `${API_BASE}/mov`,
    files: `${API_BASE}/files`,
    clarifications: `${API_BASE}/cfs`
  }

  const fetchMovement = async (id) => {
    try {
      const response = await useFetch(`${endpoints.movements}/${id}`)
      return { data: response.data.value?.data, error: null }
    } catch (error) {
      console.error('Error fetching movement:', error)
      return { data: null, error }
    }
  }

  const fetchAllMovements = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Make the API call with authentication
      const response = await fetch(endpoints.movements, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch movements')
      }

      const jsonData = await response.json()
      return { data: jsonData.data, error: null }
    } catch (error) {
      console.error('Error fetching movements:', error)
      return { data: null, error: error.message }
    }
  }

  const updateMovementStatus = async (id, status) => {
    try {
      const response = await fetch(`${endpoints.movements}/status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ WorkflowStatus: status })
      })
      if (!response.ok) throw new Error('Failed to update status')
      return { success: true, error: null }
    } catch (error) {
      console.error('Error updating movement status:', error)
      return { success: false, error }
    }
  }

  const uploadFile = async (file, movementId) => {
    try {
      // Upload file
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadResponse = await fetch(`${endpoints.files}/upload`, {
        method: 'POST',
        body: formData
      })
      
      if (!uploadResponse.ok) throw new Error('Error uploading file')
      const uploadedFile = await uploadResponse.json()
      console.log(uploadedFile)
      // Validate bank type and poder
      // if (uploadedFile.data.bankType !== 'BBVABAJA') {
      //   throw new Error('El tipo de banco debe ser BBVABAJA');
      // }

      // if (uploadedFile.data.poder !== '50%') {
      //   throw new Error('El poder debe ser 50%');
      // }

      // Save file info
      const fileResponse = await fetch(endpoints.files, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movementId,
          FileName: uploadedFile.data.filename,
          FileUrl: uploadedFile.data.url,
          bankType: uploadedFile.data.bankType,
          cuentaAbono: uploadedFile.data.cuentaAbono,
          cuentaCargo: uploadedFile.data.cuentaCargo,
          importeOperacion: uploadedFile.data.importeOperacion,
          fechaAplicacion: uploadedFile.data.fechaAplicacion,
          Status: 0,
          Stage: 3,
          CreatedBy: process.client ? localStorage.username : '999'
        })
      })

      if (!fileResponse.ok) throw new Error('Error saving file info')
      
      return { data: uploadedFile.data, error: null }
    } catch (error) {
      console.error('Error in file upload process:', error)
      return { data: null, error }
    }
  }

  const fetchClarifications = async () => {
    try {
      const response = await useFetch(`${endpoints.clarifications}`)
      return { data: response.data.value?.data, error: null }
    } catch (error) {
      console.error('Error fetching clarifications:', error)
      return { data: null, error }
    }
  }

  return {
    fetchMovement,
    fetchAllMovements,
    updateMovementStatus,
    uploadFile,
    fetchClarifications
  }
} 