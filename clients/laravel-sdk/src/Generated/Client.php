<?php

namespace FlowCatalyst\Generated;

class Client extends \FlowCatalyst\Generated\Runtime\Client\Client
{
    /**
     * @param array{
     *    "type"?: string,
     *    "clientId"?: string,
     *    "active"?: string,
     *    "email"?: string,
     *    "q"?: string,
     *    "roles"?: string,
     *    "page"?: string,
     *    "pageSize"?: string,
     *    "sortField"?: string,
     *    "sortOrder"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPrincipal(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPrincipal($queryParameters), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiPrincipalByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiPrincipalById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiPrincipalById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiPrincipalByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPrincipalById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPrincipalById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiPrincipalByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiPrincipalByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiPrincipalById(string $id, ?\FlowCatalyst\Generated\Model\ApiPrincipalsIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiPrincipalById($id, $requestBody), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiPrincipalsUserBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiPrincipalsUserConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiPrincipalsUser(?\FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiPrincipalsUser($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiPrincipalsByIdActivateNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdActivatePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiPrincipalsByIdActivate(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiPrincipalsByIdActivate($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiPrincipalsByIdDeactivateNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdDeactivatePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiPrincipalsByIdDeactivate(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiPrincipalsByIdDeactivate($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiPrincipalsByIdResetPasswordBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiPrincipalsByIdResetPasswordNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiPrincipalsByIdResetPassword(string $id, ?\FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiPrincipalsByIdResetPassword($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiPrincipalsByIdRoleNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPrincipalsByIdRole(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPrincipalsByIdRole($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiPrincipalsByIdRoleBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiPrincipalsByIdRoleNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiPrincipalsByIdRole(string $id, ?\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiPrincipalsByIdRole($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiPrincipalsByIdRoleBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiPrincipalsByIdRoleNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiPrincipalsByIdRole(string $id, ?\FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiPrincipalsByIdRole($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $role
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiPrincipalsByIdRoleByRoleNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiPrincipalsByIdRoleByRole(string $id, string $role, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiPrincipalsByIdRoleByRole($id, $role), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiPrincipalsByIdClientAccessNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPrincipalsByIdClientAccess(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPrincipalsByIdClientAccess($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiPrincipalsByIdClientAccessBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiPrincipalsByIdClientAccessNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiPrincipalsByIdClientAccessConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiPrincipalsByIdClientAccess(string $id, ?\FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiPrincipalsByIdClientAccess($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $clientId
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiPrincipalsByIdClientAccessByClientIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiPrincipalsByIdClientAccessByClientId(string $id, string $clientId, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiPrincipalsByIdClientAccessByClientId($id, $clientId), $fetch);
    }
    /**
     * @param array{
     *    "email"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiPrincipalsCheckEmailDomainBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsCheckEmailDomainGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPrincipalsCheckEmailDomain(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPrincipalsCheckEmailDomain($queryParameters), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiPrincipalsByIdApplicationAccessNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPrincipalsByIdApplicationAccess(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPrincipalsByIdApplicationAccess($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiPrincipalsByIdApplicationAccessBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiPrincipalsByIdApplicationAccessNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiPrincipalsByIdApplicationAccess(string $id, ?\FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiPrincipalsByIdApplicationAccess($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiPrincipalsByIdAvailableApplicationNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPrincipalsIdAvailableApplicationsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPrincipalsByIdAvailableApplication(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPrincipalsByIdAvailableApplication($id), $fetch);
    }
    /**
     * @param array{
     *    "status"?: string,
     *    "page"?: string,
     *    "pageSize"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiClient(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiClient($queryParameters), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiClientsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiClient(?\FlowCatalyst\Generated\Model\ApiClientsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiClient($requestBody), $fetch);
    }
    /**
     * @param array{
     *    "q"?: string,
     *    "status"?: string,
     *    "limit"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsSearchGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiClientsSearch(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiClientsSearch($queryParameters), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiClientByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiClientById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiClientById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiClientByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiClientById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiClientById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiClientsIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiClientByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiClientByIdNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PutApiClientByIdConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsIdPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiClientById(string $id, ?\FlowCatalyst\Generated\Model\ApiClientsIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiClientById($id, $requestBody), $fetch);
    }
    /**
     * @param string $identifier
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiClientsByIdentifierByIdentifierNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsByIdentifierIdentifierGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiClientsByIdentifierByIdentifier(string $identifier, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiClientsByIdentifierByIdentifier($identifier), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiClientsIdActivatePostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdActivateBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdActivateNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdActivateConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiClientsByIdActivate(string $id, ?\FlowCatalyst\Generated\Model\ApiClientsIdActivatePostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiClientsByIdActivate($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdSuspendBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdSuspendNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdSuspendConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiClientsByIdSuspend(string $id, ?\FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiClientsByIdSuspend($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdDeactivateBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdDeactivateNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdDeactivateConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiClientsByIdDeactivate(string $id, ?\FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiClientsByIdDeactivate($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiClientsIdNotesPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdNoteBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdNoteNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiClientsByIdNote(string $id, ?\FlowCatalyst\Generated\Model\ApiClientsIdNotesPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiClientsByIdNote($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiClientsByIdApplicationNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsIdApplicationsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiClientsByIdApplication(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiClientsByIdApplication($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiClientsByIdApplicationNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiClientsByIdApplication(string $id, ?\FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiClientsByIdApplication($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $applicationId
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdApplicationsByApplicationIdEnableNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdEnablePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiClientsByIdApplicationsByApplicationIdEnable(string $id, string $applicationId, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiClientsByIdApplicationsByApplicationIdEnable($id, $applicationId), $fetch);
    }
    /**
     * @param string $id
     * @param string $applicationId
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiClientsByIdApplicationsByApplicationIdDisableNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdDisablePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiClientsByIdApplicationsByApplicationIdDisable(string $id, string $applicationId, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiClientsByIdApplicationsByApplicationIdDisable($id, $applicationId), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAnchorDomainsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAnchorDomain(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAnchorDomain(), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiAnchorDomainsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiAnchorDomainBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiAnchorDomainConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiAnchorDomain(?\FlowCatalyst\Generated\Model\ApiAnchorDomainsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiAnchorDomain($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiAnchorDomainByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiAnchorDomainById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiAnchorDomainById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiAnchorDomainByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAnchorDomainsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAnchorDomainById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAnchorDomainById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiAnchorDomainByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiAnchorDomainByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiAnchorDomainById(string $id, ?\FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiAnchorDomainById($id, $requestBody), $fetch);
    }
    /**
     * @param array{
     *    "page"?: string,
     *    "pageSize"?: string,
     *    "type"?: string,
     *    "activeOnly"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiApplication(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiApplication($queryParameters), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiApplication(?\FlowCatalyst\Generated\Model\ApiApplicationsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiApplication($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiApplicationByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiApplicationById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiApplicationById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiApplicationByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiApplicationById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiApplicationById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiApplicationByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiApplicationByIdNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PutApiApplicationByIdConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiApplicationById(string $id, ?\FlowCatalyst\Generated\Model\ApiApplicationsIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiApplicationById($id, $requestBody), $fetch);
    }
    /**
     * @param string $code
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiApplicationsByCodeByCodeNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsByCodeCodeGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiApplicationsByCodeByCode(string $code, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiApplicationsByCodeByCode($code), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdActivateNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdActivateConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiApplicationsByIdActivate(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiApplicationsByIdActivate($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdDeactivateNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdDeactivateConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiApplicationsByIdDeactivate(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiApplicationsByIdDeactivate($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiApplicationsByIdClientNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsIdClientsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiApplicationsByIdClient(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiApplicationsByIdClient($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdClientBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdClientNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdClientConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiApplicationsByIdClient(string $id, ?\FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiApplicationsByIdClient($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $clientId
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiApplicationsByIdClientByClientIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiApplicationsByIdClientByClientId(string $id, string $clientId, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiApplicationsByIdClientByClientId($id, $clientId), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiApplicationsByIdRoleNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsIdRolesGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiApplicationsByIdRole(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiApplicationsByIdRole($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdProvisionServiceAccountBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdProvisionServiceAccountNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByIdProvisionServiceAccountConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiApplicationsByIdProvisionServiceAccount(string $id, ?\FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiApplicationsByIdProvisionServiceAccount($id, $requestBody), $fetch);
    }
    /**
     * @param array{
     *    "page"?: string,
     *    "pageSize"?: string,
     *    "q"?: string,
     *    "source"?: string,
     *    "applicationId"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiRolesGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiRole(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiRole($queryParameters), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiRolesPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiRoleBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiRoleConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiRolesPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiRole(?\FlowCatalyst\Generated\Model\ApiRolesPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiRole($requestBody), $fetch);
    }
    /**
     * @param string $roleName
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiRoleByRoleNameNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiRoleByRoleName(string $roleName, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiRoleByRoleName($roleName), $fetch);
    }
    /**
     * @param string $roleName
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiRoleByRoleNameNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiRolesRoleNameGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiRoleByRoleName(string $roleName, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiRoleByRoleName($roleName), $fetch);
    }
    /**
     * @param string $roleName
     * @param null|\FlowCatalyst\Generated\Model\ApiRolesRoleNamePutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiRoleByRoleNameBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiRoleByRoleNameNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PutApiRoleByRoleNameConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiRoleByRoleName(string $roleName, ?\FlowCatalyst\Generated\Model\ApiRolesRoleNamePutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiRoleByRoleName($roleName, $requestBody), $fetch);
    }
    /**
     * @param string $source
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiRolesBySourceBySourceBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiRolesBySourceSourceGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiRolesBySourceBySource(string $source, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiRolesBySourceBySource($source), $fetch);
    }
    /**
     * @param string $applicationId
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiRolesByApplicationApplicationIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiRolesByApplicationByApplicationId(string $applicationId, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiRolesByApplicationByApplicationId($applicationId), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiRolesPermissionsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiRolesPermission(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiRolesPermission(), $fetch);
    }
    /**
     * @param string $permission
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiRolesPermissionByPermissionNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiRolesPermissionsPermissionGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiRolesPermissionByPermission(string $permission, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiRolesPermissionByPermission($permission), $fetch);
    }
    /**
     * @param array{
     *    "clientId"?: string,
     *    "configType"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuthConfigsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAuthConfig(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAuthConfig($queryParameters), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiAuthConfigByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiAuthConfigById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiAuthConfigById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiAuthConfigByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuthConfigsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAuthConfigById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAuthConfigById($id), $fetch);
    }
    /**
     * @param string $domain
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiAuthConfigsByDomainByDomainNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuthConfigsByDomainDomainGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAuthConfigsByDomainByDomain(string $domain, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAuthConfigsByDomainByDomain($domain), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiAuthConfigsInternalBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiAuthConfigsInternalConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiAuthConfigsInternal(?\FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiAuthConfigsInternal($requestBody), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiAuthConfigsOidcBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiAuthConfigsOidcConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiAuthConfigsOidc(?\FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiAuthConfigsOidc($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdOidcBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdOidcNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdOidcConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiAuthConfigsByIdOidc(string $id, ?\FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiAuthConfigsByIdOidc($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdConfigTypeBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdConfigTypeNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdConfigTypeConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiAuthConfigsByIdConfigType(string $id, ?\FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiAuthConfigsByIdConfigType($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdAdditionalClientBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdAdditionalClientNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiAuthConfigsByIdAdditionalClient(string $id, ?\FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiAuthConfigsByIdAdditionalClient($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdGrantedClientBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiAuthConfigsByIdGrantedClientNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiAuthConfigsByIdGrantedClient(string $id, ?\FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiAuthConfigsByIdGrantedClient($id, $requestBody), $fetch);
    }
    /**
     * @param array{
     *    "active"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiOauthClientsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiOauthClient(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiOauthClient($queryParameters), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiOauthClientsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiOauthClientBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiOauthClientConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiOauthClient(?\FlowCatalyst\Generated\Model\ApiOauthClientsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiOauthClient($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiOauthClientByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiOauthClientById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiOauthClientById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiOauthClientByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiOauthClientsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiOauthClientById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiOauthClientById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiOauthClientsIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiOauthClientByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiOauthClientByIdNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PutApiOauthClientByIdConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiOauthClientById(string $id, ?\FlowCatalyst\Generated\Model\ApiOauthClientsIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiOauthClientById($id, $requestBody), $fetch);
    }
    /**
     * @param string $clientId
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiOauthClientsByClientIdByClientIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiOauthClientsByClientIdClientIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiOauthClientsByClientIdByClientId(string $clientId, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiOauthClientsByClientIdByClientId($clientId), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiOauthClientsByIdRegenerateSecretBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiOauthClientsByIdRegenerateSecretNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiOauthClientsByIdRegenerateSecret(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiOauthClientsByIdRegenerateSecret($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiOauthClientsByIdActivateNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiOauthClientsIdActivatePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiOauthClientsByIdActivate(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiOauthClientsByIdActivate($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiOauthClientsByIdDeactivateNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiOauthClientsIdDeactivatePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiOauthClientsByIdDeactivate(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiOauthClientsByIdDeactivate($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiOauthClientsByIdRotateSecretBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiOauthClientsByIdRotateSecretNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiOauthClientsByIdRotateSecret(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiOauthClientsByIdRotateSecret($id), $fetch);
    }
    /**
     * @param array{
     *    "entityType"?: string,
     *    "entityId"?: string,
     *    "principalId"?: string,
     *    "operation"?: string,
     *    "applicationIds"?: string,
     *    "clientIds"?: string,
     *    "page"?: string,
     *    "pageSize"?: string,
     *    "sortField"?: string,
     *    "sortOrder"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuditLogsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAuditLog(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAuditLog($queryParameters), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiAuditLogByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuditLogsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAuditLogById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAuditLogById($id), $fetch);
    }
    /**
     * @param string $entityType
     * @param string $entityId
     * @param array{
     *    "page"?: string,
     *    "pageSize"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuditLogsEntityEntityTypeEntityIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAuditLogsEntityByEntityTypeByEntityId(string $entityType, string $entityId, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAuditLogsEntityByEntityTypeByEntityId($entityType, $entityId, $queryParameters), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuditLogsEntityTypesGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAuditLogsEntityType(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAuditLogsEntityType(), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuditLogsOperationsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAuditLogsOperation(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAuditLogsOperation(), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuditLogsApplicationIdsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAuditLogsApplicationId(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAuditLogsApplicationId(), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiAuditLogsClientIdsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiAuditLogsClientId(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiAuditLogsClientId(), $fetch);
    }
    /**
     * @param array{
     *    "status"?: string,
     *    "application"?: array,
     *    "subdomain"?: array,
     *    "aggregate"?: array,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEventType(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEventType($queryParameters), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiEventTypesPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiEventTypeBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiEventTypeConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiEventType(?\FlowCatalyst\Generated\Model\ApiEventTypesPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiEventType($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiEventTypeByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiEventTypeById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiEventTypeById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiEventTypeByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEventTypeById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEventTypeById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiEventTypesIdPatchBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PatchApiEventTypeByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PatchApiEventTypeByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function patchApiEventTypeById(string $id, ?\FlowCatalyst\Generated\Model\ApiEventTypesIdPatchBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PatchApiEventTypeById($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiEventTypesByIdCodegenBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiEventTypesByIdCodegenNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiEventTypesByIdCodegen(string $id, ?\FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiEventTypesByIdCodegen($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiEventTypesByIdArchiveNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesIdArchivePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiEventTypesByIdArchive(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiEventTypesByIdArchive($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiEventTypesByIdSchemaBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiEventTypesByIdSchemaNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiEventTypesByIdSchema(string $id, ?\FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiEventTypesByIdSchema($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $version
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiEventTypesByIdSchemasByVersionFinaliseNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionFinalisePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiEventTypesByIdSchemasByVersionFinalise(string $id, string $version, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiEventTypesByIdSchemasByVersionFinalise($id, $version), $fetch);
    }
    /**
     * @param string $id
     * @param string $version
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiEventTypesByIdSchemasByVersionDeprecateNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionDeprecatePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiEventTypesByIdSchemasByVersionDeprecate(string $id, string $version, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiEventTypesByIdSchemasByVersionDeprecate($id, $version), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiEventTypesSyncPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiEventTypesSyncBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesSyncPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiEventTypesSync(?\FlowCatalyst\Generated\Model\ApiEventTypesSyncPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiEventTypesSync($requestBody), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesFiltersApplicationsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEventTypesFiltersApplication(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEventTypesFiltersApplication(), $fetch);
    }
    /**
     * @param array{
     *    "application"?: array,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesFiltersSubdomainsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEventTypesFiltersSubdomain(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEventTypesFiltersSubdomain($queryParameters), $fetch);
    }
    /**
     * @param array{
     *    "application"?: array,
     *    "subdomain"?: array,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventTypesFiltersAggregatesGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEventTypesFiltersAggregate(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEventTypesFiltersAggregate($queryParameters), $fetch);
    }
    /**
     * @param array{
     *    "clientId"?: string,
     *    "status"?: string,
     *    "anchorLevel"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiDispatchPoolsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiDispatchPool(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiDispatchPool($queryParameters), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiDispatchPoolsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiDispatchPoolBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiDispatchPoolConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiDispatchPool(?\FlowCatalyst\Generated\Model\ApiDispatchPoolsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiDispatchPool($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiDispatchPoolByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiDispatchPoolById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiDispatchPoolById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiDispatchPoolByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiDispatchPoolById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiDispatchPoolById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiDispatchPoolByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiDispatchPoolByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiDispatchPoolById(string $id, ?\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiDispatchPoolById($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiDispatchPoolsByIdSuspendNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdSuspendPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiDispatchPoolsByIdSuspend(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiDispatchPoolsByIdSuspend($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiDispatchPoolsByIdActivateNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiDispatchPoolsIdActivatePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiDispatchPoolsByIdActivate(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiDispatchPoolsByIdActivate($id), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiDispatchPoolsSyncBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiDispatchPoolsSync(?\FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiDispatchPoolsSync($requestBody), $fetch);
    }
    /**
     * @param array{
     *    "clientId"?: string,
     *    "status"?: string,
     *    "serviceAccountId"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConnectionsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiConnection(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiConnection($queryParameters), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiConnectionsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiConnectionBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiConnectionConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConnectionsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiConnection(?\FlowCatalyst\Generated\Model\ApiConnectionsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiConnection($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiConnectionByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiConnectionByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiConnectionById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiConnectionById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiConnectionByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConnectionsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiConnectionById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiConnectionById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiConnectionsIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiConnectionByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiConnectionByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiConnectionById(string $id, ?\FlowCatalyst\Generated\Model\ApiConnectionsIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiConnectionById($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiConnectionsByIdPauseNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConnectionsIdPausePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiConnectionsByIdPause(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiConnectionsByIdPause($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiConnectionsByIdActivateNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConnectionsIdActivatePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiConnectionsByIdActivate(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiConnectionsByIdActivate($id), $fetch);
    }
    /**
     * @param array{
     *    "clientId"?: string,
     *    "status"?: string,
     *    "source"?: string,
     *    "dispatchPoolId"?: string,
     *    "anchorLevel"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiSubscriptionsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiSubscription(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiSubscription($queryParameters), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiSubscriptionsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiSubscriptionBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiSubscriptionConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiSubscription(?\FlowCatalyst\Generated\Model\ApiSubscriptionsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiSubscription($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiSubscriptionByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiSubscriptionById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiSubscriptionById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiSubscriptionByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiSubscriptionById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiSubscriptionById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiSubscriptionByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiSubscriptionByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiSubscriptionById(string $id, ?\FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiSubscriptionById($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiSubscriptionsByIdPauseNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiSubscriptionsByIdPause(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiSubscriptionsByIdPause($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiSubscriptionsByIdResumeNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiSubscriptionsByIdResume(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiSubscriptionsByIdResume($id), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiSubscriptionsSyncBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiSubscriptionsSync(?\FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiSubscriptionsSync($requestBody), $fetch);
    }
    /**
     * @param array{
     *    "clientIds"?: string,
     *    "applications"?: string,
     *    "subdomains"?: string,
     *    "aggregates"?: string,
     *    "types"?: string,
     *    "source"?: string,
     *    "subject"?: string,
     *    "correlationId"?: string,
     *    "messageGroup"?: string,
     *    "timeAfter"?: string,
     *    "timeBefore"?: string,
     *    "page"?: string,
     *    "size"?: string,
     *    "sortField"?: string,
     *    "sortOrder"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEvent(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEvent($queryParameters), $fetch);
    }
    /**
     * @param array{
     *    "clientIds"?: string,
     *    "applications"?: string,
     *    "subdomains"?: string,
     *    "aggregates"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventsFilterOptionsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEventsFilterOption(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEventsFilterOption($queryParameters), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiEventByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEventsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEventById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEventById($id), $fetch);
    }
    /**
     * @param array{
     *    "page"?: string,
     *    "size"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEventsRaw(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEventsRaw($queryParameters), $fetch);
    }
    /**
     * @param array{
     *    "clientIds"?: string,
     *    "statuses"?: string,
     *    "applications"?: string,
     *    "subdomains"?: string,
     *    "aggregates"?: string,
     *    "codes"?: string,
     *    "source"?: string,
     *    "kind"?: string,
     *    "subscriptionId"?: string,
     *    "dispatchPoolId"?: string,
     *    "messageGroup"?: string,
     *    "createdAfter"?: string,
     *    "createdBefore"?: string,
     *    "page"?: string,
     *    "size"?: string,
     *    "sortField"?: string,
     *    "sortOrder"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiDispatchJobsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiDispatchJob(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiDispatchJob($queryParameters), $fetch);
    }
    /**
     * @param array{
     *    "clientIds"?: string,
     *    "applications"?: string,
     *    "subdomains"?: string,
     *    "aggregates"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiDispatchJobsFilterOption(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiDispatchJobsFilterOption($queryParameters), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiDispatchJobByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiDispatchJobsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiDispatchJobById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiDispatchJobById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiDispatchJobsByIdAttemptNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiDispatchJobsIdAttemptsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiDispatchJobsByIdAttempt(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiDispatchJobsByIdAttempt($id), $fetch);
    }
    /**
     * @param array{
     *    "page"?: string,
     *    "size"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiDispatchJobsRaw(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiDispatchJobsRaw($queryParameters), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiIdentityProvidersGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiIdentityProvider(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiIdentityProvider(), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiIdentityProvidersPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiIdentityProviderBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiIdentityProviderConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiIdentityProvider(?\FlowCatalyst\Generated\Model\ApiIdentityProvidersPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiIdentityProvider($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiIdentityProviderByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiIdentityProviderById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiIdentityProviderById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiIdentityProviderByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiIdentityProvidersIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiIdentityProviderById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiIdentityProviderById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiIdentityProviderByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiIdentityProviderByIdNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PutApiIdentityProviderByIdConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiIdentityProviderById(string $id, ?\FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiIdentityProviderById($id, $requestBody), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEmailDomainMapping(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEmailDomainMapping(), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiEmailDomainMappingBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiEmailDomainMappingConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiEmailDomainMapping(?\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiEmailDomainMapping($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiEmailDomainMappingByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiEmailDomainMappingById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiEmailDomainMappingById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiEmailDomainMappingByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEmailDomainMappingById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEmailDomainMappingById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiEmailDomainMappingByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiEmailDomainMappingByIdNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PutApiEmailDomainMappingByIdConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiEmailDomainMappingById(string $id, ?\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiEmailDomainMappingById($id, $requestBody), $fetch);
    }
    /**
     * @param string $domain
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiEmailDomainMappingsLookupByDomainNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiEmailDomainMappingsLookupDomainGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiEmailDomainMappingsLookupByDomain(string $domain, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiEmailDomainMappingsLookupByDomain($domain), $fetch);
    }
    /**
     * @param array{
     *    "clientId"?: string,
     *    "applicationId"?: string,
     *    "active"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiServiceAccount(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiServiceAccount($queryParameters), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiServiceAccountsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiServiceAccountBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiServiceAccountConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiServiceAccount(?\FlowCatalyst\Generated\Model\ApiServiceAccountsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiServiceAccount($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiServiceAccountByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiServiceAccountById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiServiceAccountById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiServiceAccountByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiServiceAccountById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiServiceAccountById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiServiceAccountByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiServiceAccountByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiServiceAccountById(string $id, ?\FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiServiceAccountById($id, $requestBody), $fetch);
    }
    /**
     * @param string $code
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiServiceAccountsCodeByCodeNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsCodeCodeGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiServiceAccountsCodeByCode(string $code, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiServiceAccountsCodeByCode($code), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiServiceAccountsByIdAuthTokenBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiServiceAccountsByIdAuthTokenNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiServiceAccountsByIdAuthToken(string $id, ?\FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiServiceAccountsByIdAuthToken($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiServiceAccountsByIdRegenerateTokenNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateTokenPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiServiceAccountsByIdRegenerateToken(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiServiceAccountsByIdRegenerateToken($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiServiceAccountsByIdRegenerateAuthTokenNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateAuthTokenPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiServiceAccountsByIdRegenerateAuthToken(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiServiceAccountsByIdRegenerateAuthToken($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiServiceAccountsByIdRegenerateSecretNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSecretPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiServiceAccountsByIdRegenerateSecret(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiServiceAccountsByIdRegenerateSecret($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiServiceAccountsByIdRegenerateSigningSecretNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSigningSecretPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiServiceAccountsByIdRegenerateSigningSecret(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiServiceAccountsByIdRegenerateSigningSecret($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiServiceAccountsByIdRoleNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiServiceAccountsByIdRole(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiServiceAccountsByIdRole($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiServiceAccountsByIdRoleBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiServiceAccountsByIdRoleNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiServiceAccountsByIdRole(string $id, ?\FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiServiceAccountsByIdRole($id, $requestBody), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPlatformCorsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPlatformCor(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPlatformCor(), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiPlatformCorsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiPlatformCorBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiPlatformCorConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiPlatformCor(?\FlowCatalyst\Generated\Model\ApiPlatformCorsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiPlatformCor($requestBody), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPlatformCorsAllowedGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPlatformCorsAllowed(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPlatformCorsAllowed(), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiPlatformCorByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiPlatformCorById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiPlatformCorById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiPlatformCorByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPlatformCorsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPlatformCorById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPlatformCorById($id), $fetch);
    }
    /**
     * @param string $appCode
     * @param array{
     *    "scope"?: string,
     *    "clientId"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiConfigByAppCodeForbiddenException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConfigAppCodeGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiConfigByAppCode(string $appCode, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiConfigByAppCode($appCode, $queryParameters), $fetch);
    }
    /**
     * @param string $appCode
     * @param string $section
     * @param array{
     *    "scope"?: string,
     *    "clientId"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiConfigByAppCodeBySectionForbiddenException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiConfigByAppCodeBySection(string $appCode, string $section, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiConfigByAppCodeBySection($appCode, $section, $queryParameters), $fetch);
    }
    /**
     * @param string $appCode
     * @param string $section
     * @param string $property
     * @param array{
     *    "scope"?: string,
     *    "clientId"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiConfigByAppCodeBySectionByPropertyForbiddenException
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiConfigByAppCodeBySectionByPropertyNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiConfigByAppCodeBySectionByProperty(string $appCode, string $section, string $property, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiConfigByAppCodeBySectionByProperty($appCode, $section, $property, $queryParameters), $fetch);
    }
    /**
     * @param string $appCode
     * @param string $section
     * @param string $property
     * @param array{
     *    "scope"?: string,
     *    "clientId"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiConfigByAppCodeBySectionByPropertyForbiddenException
     * @throws \FlowCatalyst\Generated\Exception\GetApiConfigByAppCodeBySectionByPropertyNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiConfigByAppCodeBySectionByProperty(string $appCode, string $section, string $property, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiConfigByAppCodeBySectionByProperty($appCode, $section, $property, $queryParameters), $fetch);
    }
    /**
     * @param string $appCode
     * @param string $section
     * @param string $property
     * @param null|\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutBody $requestBody
     * @param array{
     *    "scope"?: string,
     *    "clientId"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiConfigByAppCodeBySectionByPropertyBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiConfigByAppCodeBySectionByPropertyForbiddenException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse200|\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiConfigByAppCodeBySectionByProperty(string $appCode, string $section, string $property, ?\FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutBody $requestBody = null, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiConfigByAppCodeBySectionByProperty($appCode, $section, $property, $requestBody, $queryParameters), $fetch);
    }
    /**
     * @param string $appCode
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiConfigAccessByAppCode(string $appCode, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiConfigAccessByAppCode($appCode), $fetch);
    }
    /**
     * @param string $appCode
     * @param null|\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiConfigAccessByAppCodeConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiConfigAccessByAppCode(string $appCode, ?\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiConfigAccessByAppCode($appCode, $requestBody), $fetch);
    }
    /**
     * @param string $appCode
     * @param string $roleCode
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiConfigAccessByAppCodeByRoleCodeNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiConfigAccessByAppCodeByRoleCode(string $appCode, string $roleCode, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiConfigAccessByAppCodeByRoleCode($appCode, $roleCode), $fetch);
    }
    /**
     * @param string $appCode
     * @param string $roleCode
     * @param null|\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiConfigAccessByAppCodeByRoleCodeNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiConfigAccessByAppCodeByRoleCode(string $appCode, string $roleCode, ?\FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiConfigAccessByAppCodeByRoleCode($appCode, $roleCode, $requestBody), $fetch);
    }
    /**
     * @param array{
     *    "attemptType"?: string,
     *    "outcome"?: string,
     *    "identifier"?: string,
     *    "principalId"?: string,
     *    "dateFrom"?: string,
     *    "dateTo"?: string,
     *    "page"?: string,
     *    "pageSize"?: string,
     *    "sortField"?: string,
     *    "sortOrder"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiLoginAttemptsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiLoginAttempt(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiLoginAttempt($queryParameters), $fetch);
    }
    /**
     * @param array{
     *    "clientId"?: string,
     *    "platformScoped"?: bool,
     *    "status"?: string,
     *    "search"?: string,
     *    "limit"?: int,
     *    "offset"?: int,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiScheduledJob(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiScheduledJob($queryParameters), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiScheduledJobsPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiScheduledJob(?\FlowCatalyst\Generated\Model\ApiScheduledJobsPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiScheduledJob($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiScheduledJobByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiScheduledJobById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiScheduledJobById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiScheduledJobByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiScheduledJobById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiScheduledJobById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PatchApiScheduledJobByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PatchApiScheduledJobByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function patchApiScheduledJobById(string $id, ?\FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PatchApiScheduledJobById($id, $requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsByIdPauseNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsByIdPauseConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiScheduledJobsByIdPause(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiScheduledJobsByIdPause($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsByIdResumeNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsByIdResumeConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiScheduledJobsByIdResume(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiScheduledJobsByIdResume($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsByIdArchiveNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsByIdArchiveConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiScheduledJobsByIdArchive(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiScheduledJobsByIdArchive($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsByIdFireNotFoundException
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsByIdFireConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse202 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiScheduledJobsByIdFire(string $id, ?\FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiScheduledJobsByIdFire($id, $requestBody), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsSyncBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiScheduledJobsSync(?\FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiScheduledJobsSync($requestBody), $fetch);
    }
    /**
     * @param array{
     *    "scheduledJobId"?: string,
     *    "clientId"?: string,
     *    "status"?: string,
     *    "triggerKind"?: string,
     *    "from"?: string,
     *    "to"?: string,
     *    "limit"?: int,
     *    "offset"?: int,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiScheduledJobsInstanceNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiScheduledJobsInstance(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiScheduledJobsInstance($queryParameters), $fetch);
    }
    /**
     * @param string $instanceId
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiScheduledJobsInstanceByInstanceIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiScheduledJobsInstanceByInstanceId(string $instanceId, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiScheduledJobsInstanceByInstanceId($instanceId), $fetch);
    }
    /**
     * @param string $instanceId
     * @param array{
     *    "limit"?: int,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiScheduledJobsInstancesByInstanceIdLogNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiScheduledJobsInstancesByInstanceIdLog(string $instanceId, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiScheduledJobsInstancesByInstanceIdLog($instanceId, $queryParameters), $fetch);
    }
    /**
     * @param string $instanceId
     * @param null|\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsInstancesByInstanceIdLogNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiScheduledJobsInstancesByInstanceIdLog(string $instanceId, ?\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiScheduledJobsInstancesByInstanceIdLog($instanceId, $requestBody), $fetch);
    }
    /**
     * @param string $instanceId
     * @param null|\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiScheduledJobsInstancesByInstanceIdCompleteNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiScheduledJobsInstancesByInstanceIdComplete(string $instanceId, ?\FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiScheduledJobsInstancesByInstanceIdComplete($instanceId, $requestBody), $fetch);
    }
    /**
     * @param array{
     *    "application"?: string,
     *    "subdomain"?: string,
     *    "status"?: string,
     *    "search"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiProcessesGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiProcess(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiProcess($queryParameters), $fetch);
    }
    /**
     * @param null|\FlowCatalyst\Generated\Model\ApiProcessesPostBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiProcessBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PostApiProcessConflictException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiProcessesPostResponse201 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiProcess(?\FlowCatalyst\Generated\Model\ApiProcessesPostBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiProcess($requestBody), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\DeleteApiProcessByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function deleteApiProcessById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\DeleteApiProcessById($id), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiProcessByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiProcessesIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiProcessById(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiProcessById($id), $fetch);
    }
    /**
     * @param string $id
     * @param null|\FlowCatalyst\Generated\Model\ApiProcessesIdPutBody $requestBody
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PutApiProcessByIdBadRequestException
     * @throws \FlowCatalyst\Generated\Exception\PutApiProcessByIdNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function putApiProcessById(string $id, ?\FlowCatalyst\Generated\Model\ApiProcessesIdPutBody $requestBody = null, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PutApiProcessById($id, $requestBody), $fetch);
    }
    /**
     * @param string $code
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiProcessesByCodeByCodeNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiProcessesByCodeCodeGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiProcessesByCodeByCode(string $code, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiProcessesByCodeByCode($code), $fetch);
    }
    /**
     * @param string $id
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiProcessesByIdArchiveNotFoundException
     *
     * @return ($fetch is 'object' ? null : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiProcessesByIdArchive(string $id, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiProcessesByIdArchive($id), $fetch);
    }
    /**
     * @param string $appCode
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostBody $requestBody
     * @param array{
     *    "removeUnlisted"?: bool,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByAppCodeRolesSyncBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiApplicationsByAppCodeRolesSync(string $appCode, ?\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostBody $requestBody = null, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiApplicationsByAppCodeRolesSync($appCode, $requestBody, $queryParameters), $fetch);
    }
    /**
     * @param string $appCode
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostBody $requestBody
     * @param array{
     *    "removeUnlisted"?: bool,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByAppCodeEventTypesSyncBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiApplicationsByAppCodeEventTypesSync(string $appCode, ?\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostBody $requestBody = null, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiApplicationsByAppCodeEventTypesSync($appCode, $requestBody, $queryParameters), $fetch);
    }
    /**
     * @param string $appCode
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBody $requestBody
     * @param array{
     *    "removeUnlisted"?: bool,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByAppCodeSubscriptionsSyncBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiApplicationsByAppCodeSubscriptionsSync(string $appCode, ?\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBody $requestBody = null, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiApplicationsByAppCodeSubscriptionsSync($appCode, $requestBody, $queryParameters), $fetch);
    }
    /**
     * @param string $appCode
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostBody $requestBody
     * @param array{
     *    "removeUnlisted"?: bool,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByAppCodeDispatchPoolsSyncBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiApplicationsByAppCodeDispatchPoolsSync(string $appCode, ?\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostBody $requestBody = null, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiApplicationsByAppCodeDispatchPoolsSync($appCode, $requestBody, $queryParameters), $fetch);
    }
    /**
     * @param string $appCode
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostBody $requestBody
     * @param array{
     *    "removeUnlisted"?: bool,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByAppCodePrincipalsSyncBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiApplicationsByAppCodePrincipalsSync(string $appCode, ?\FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostBody $requestBody = null, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiApplicationsByAppCodePrincipalsSync($appCode, $requestBody, $queryParameters), $fetch);
    }
    /**
     * @param string $appCode
     * @param null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostBody $requestBody
     * @param array{
     *    "removeUnlisted"?: bool,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\PostApiApplicationsByAppCodeProcessesSyncBadRequestException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function postApiApplicationsByAppCodeProcessesSync(string $appCode, ?\FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostBody $requestBody = null, array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\PostApiApplicationsByAppCodeProcessesSync($appCode, $requestBody, $queryParameters), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiMeClientUnauthorizedException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiMeClientsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiMeClient(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiMeClient(), $fetch);
    }
    /**
     * @param string $clientId
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiMeClientByClientIdUnauthorizedException
     * @throws \FlowCatalyst\Generated\Exception\GetApiMeClientByClientIdForbiddenException
     * @throws \FlowCatalyst\Generated\Exception\GetApiMeClientByClientIdNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiMeClientsClientIdGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiMeClientByClientId(string $clientId, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiMeClientByClientId($clientId), $fetch);
    }
    /**
     * @param string $clientId
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     * @throws \FlowCatalyst\Generated\Exception\GetApiMeClientsByClientIdApplicationUnauthorizedException
     * @throws \FlowCatalyst\Generated\Exception\GetApiMeClientsByClientIdApplicationForbiddenException
     * @throws \FlowCatalyst\Generated\Exception\GetApiMeClientsByClientIdApplicationNotFoundException
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiMeClientsClientIdApplicationsGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiMeClientsByClientIdApplication(string $clientId, string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiMeClientsByClientIdApplication($clientId), $fetch);
    }
    /**
     * @param array{
     *    "clientId"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPublicLoginThemeGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPublicLoginTheme(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPublicLoginTheme($queryParameters), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiPublicPlatformGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiPublicPlatform(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiPublicPlatform(), $fetch);
    }
    /**
     * @param array{
     *    "clientId"?: string,
     * } $queryParameters
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConfigLoginThemeGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiConfigLoginTheme(array $queryParameters = [], string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiConfigLoginTheme($queryParameters), $fetch);
    }
    /**
     * @param string $fetch Fetch mode to use (can be OBJECT or RESPONSE)
     *
     * @return ($fetch is 'object' ? null|\FlowCatalyst\Generated\Model\ApiConfigPlatformGetResponse200 : \Psr\Http\Message\ResponseInterface)
     */
    public function getApiConfigPlatform(string $fetch = self::FETCH_OBJECT)
    {
        return $this->executeEndpoint(new \FlowCatalyst\Generated\Endpoint\GetApiConfigPlatform(), $fetch);
    }
    public static function create($httpClient = null, array $additionalPlugins = [], array $additionalNormalizers = [])
    {
        if (null === $httpClient) {
            $httpClient = \Http\Discovery\Psr18ClientDiscovery::find();
            $plugins = [];
            if (count($additionalPlugins) > 0) {
                $plugins = array_merge($plugins, $additionalPlugins);
            }
            $httpClient = new \Http\Client\Common\PluginClient($httpClient, $plugins);
        }
        $requestFactory = \Http\Discovery\Psr17FactoryDiscovery::findRequestFactory();
        $streamFactory = \Http\Discovery\Psr17FactoryDiscovery::findStreamFactory();
        $normalizers = [new \Symfony\Component\Serializer\Normalizer\ArrayDenormalizer(), new \FlowCatalyst\Generated\Normalizer\JaneObjectNormalizer()];
        if (count($additionalNormalizers) > 0) {
            $normalizers = array_merge($normalizers, $additionalNormalizers);
        }
        $serializer = new \Symfony\Component\Serializer\Serializer($normalizers, [new \Symfony\Component\Serializer\Encoder\JsonEncoder(new \Symfony\Component\Serializer\Encoder\JsonEncode(), new \Symfony\Component\Serializer\Encoder\JsonDecode(['json_decode_associative' => true]))]);
        return new static($httpClient, $requestFactory, $serializer, $streamFactory);
    }
}