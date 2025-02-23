// Copyright 2023 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { fetchJson, StatusError } from '@perses-dev/core';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import buildURL from './url-builder';

const resource = 'health';

export interface HealthModel {
  buildTime: string;
  version: string;
  commit: string;
}

type HealthOptions = Omit<UseQueryOptions<HealthModel, StatusError>, 'queryKey' | 'queryFn'>;

/**
 * Gets version information from the Perses server API.
 */
export function useHealth(options?: HealthOptions): UseQueryResult<HealthModel, StatusError> {
  return useQuery<HealthModel, StatusError>({
    queryKey: [resource],
    queryFn: () => {
      const url = buildURL({ resource });
      return fetchJson<HealthModel>(url);
    },
    ...options,
  });
}
