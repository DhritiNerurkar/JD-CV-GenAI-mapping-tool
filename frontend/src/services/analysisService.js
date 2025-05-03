import apiClient from './apiClient'; // Still use for base URL

export const analyzeCvs = async (cvFiles, jdIds) => {
  console.log("[analysisService] Started (Using Native Fetch)");
  console.log("[analysisService] Received cvFiles:", cvFiles);
  console.log("[analysisService] Received jdIds:", jdIds);

  const formData = new FormData();
  let fileAppended = false;

  // --- Validate and Append Files ---
  console.log("[analysisService] Appending files to FormData...");
  if (cvFiles && typeof cvFiles[Symbol.iterator] === 'function') {
    cvFiles.forEach((file, index) => {
      if (file instanceof File) {
        formData.append('cv_files', file, file.name);
        console.log(`[analysisService] Appended File ${index}: ${file.name} to key 'cv_files'`);
        fileAppended = true;
      } else {
        console.warn(`[analysisService] Item at index ${index} is NOT a File object, skipping. Item:`, file);
      }
    });
  } else {
    console.error("[analysisService] cvFiles received is not iterable or is null/undefined.");
    throw new Error("CV file data is invalid.");
  }

  if (!fileAppended) {
    console.error("[analysisService] No valid files were found to append.");
    throw new Error("No valid CV files were provided for upload.");
  }

  // --- Append JD IDs ---
  console.log("[analysisService] Appending JD IDs to FormData...");
  if (jdIds && typeof jdIds[Symbol.iterator] === 'function' && jdIds.length > 0) {
    jdIds.forEach(id => {
      formData.append('jd_ids', id);
      console.log(`[analysisService] Appended jd_id: ${id} to key 'jd_ids'`);
    });
    if (!formData.has('jd_ids')) {
         console.error("[analysisService] Failed to append JD IDs.");
         throw new Error("Failed to process selected Job Descriptions.");
    }
  } else {
     console.error("[analysisService] jdIds received is not iterable or is null/undefined/empty.");
     throw new Error("No Job Description IDs selected.");
  }

  // --- Log FormData before sending ---
  console.log("[analysisService] --- Checking FormData before sending ---");
  if (formData.has('cv_files')){
     console.log(`[analysisService] Key 'cv_files' exists. Count: ${formData.getAll('cv_files').length}`);
  } else {
     console.error("[analysisService] CRITICAL: Key 'cv_files' MISSING before send!");
  }
  if (formData.has('jd_ids')){
     console.log(`[analysisService] Key 'jd_ids' exists. Values:`, formData.getAll('jd_ids'));
  } else {
     console.error("[analysisService] CRITICAL: Key 'jd_ids' MISSING before send!");
  }
  console.log("[analysisService] --- End FormData Check ---");
  // --- End Log ---

  // --- Use Native Fetch ---
  const apiUrl = `${apiClient.defaults.baseURL}/analyze`;
  console.log(`[analysisService] Sending POST request to ${apiUrl} using fetch...`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      // NO Content-Type header here for fetch + FormData
    });

    console.log("[analysisService] Fetch response status:", response.status);
    console.log("[analysisService] Fetch response ok:", response.ok);

    const responseBody = await response.text(); // Get body as text first for debugging

    if (!response.ok) {
      let errorData = { error: `HTTP error! Status: ${response.status}`, details: responseBody };
      try {
        // Try parsing AFTER checking ok status
        errorData = JSON.parse(responseBody);
        console.error("[analysisService] Fetch error response JSON data:", errorData);
      } catch (jsonError) {
        console.error(`[analysisService] Fetch error response body (not JSON): ${responseBody}`);
      }
      throw errorData; // Throw the parsed/constructed error object
    }

    // If response is OK, parse the JSON body for success data
     try {
        const data = JSON.parse(responseBody);
        console.log("[analysisService] Fetch response data (success):", data);
        return data;
    } catch (jsonError) {
         console.error(`[analysisService] Failed to parse success response JSON: ${jsonError}`);
         console.error(`[analysisService] Success response body text: ${responseBody}`);
         throw new Error("Received non-JSON success response from server.");
    }

  } catch (error) {
    // Catch network errors or errors thrown from !response.ok check / JSON parsing
    console.error("[analysisService] Error during fetch call or response handling:", error);
    // Re-throw the error object
    throw error;
  }
  // --- End Use Native Fetch ---
};