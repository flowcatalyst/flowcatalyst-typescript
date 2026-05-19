<?php

namespace FlowCatalyst\Generated\Normalizer;

use FlowCatalyst\Generated\Runtime\Normalizer\CheckArray;
use FlowCatalyst\Generated\Runtime\Normalizer\ValidatorTrait;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
class JaneObjectNormalizer implements DenormalizerInterface, NormalizerInterface, DenormalizerAwareInterface, NormalizerAwareInterface
{
    use DenormalizerAwareTrait;
    use NormalizerAwareTrait;
    use CheckArray;
    use ValidatorTrait;
    protected $normalizers = [
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsGetResponse200PrincipalsItem::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsGetResponse200PrincipalsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsUsersPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsUsersPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsUsersPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsUsersPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdActivatePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdActivatePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdActivatePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdActivatePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdDeactivatePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdDeactivatePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdDeactivatePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdDeactivatePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdResetPasswordPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdResetPasswordPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdResetPasswordPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdResetPasswordPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesGetResponse200RolesItem::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesGetResponse200RolesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse200RolesItem::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesPutResponse200RolesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesRoleDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdRolesRoleDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdClientAccessGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessGetResponse200GrantsItem::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdClientAccessGetResponse200GrantsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdClientAccessGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdClientAccessPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdClientAccessPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdClientAccessPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdClientAccessPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdClientAccessPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessClientIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdClientAccessClientIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsCheckEmailDomainGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsCheckEmailDomainGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsCheckEmailDomainGetResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsCheckEmailDomainGetResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdApplicationAccessGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessGetResponse200ApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdApplicationAccessGetResponse200ApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdApplicationAccessGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdApplicationAccessPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdApplicationAccessPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse200ApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdApplicationAccessPutResponse200ApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdApplicationAccessPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdApplicationAccessPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdAvailableApplicationsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdAvailableApplicationsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdAvailableApplicationsGetResponse200ApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdAvailableApplicationsGetResponse200ApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPrincipalsIdAvailableApplicationsGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPrincipalsIdAvailableApplicationsGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsGetResponse200ClientsItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsGetResponse200ClientsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsGetResponse200ClientsItemNotesItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsGetResponse200ClientsItemNotesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiClientsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiClientsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsPostResponse201NotesItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsPostResponse201NotesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiClientsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiClientsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsSearchGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsSearchGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsSearchGetResponse200ClientsItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsSearchGetResponse200ClientsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsSearchGetResponse200ClientsItemNotesItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsSearchGetResponse200ClientsItemNotesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdGetResponse200NotesItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdGetResponse200NotesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse200NotesItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdPutResponse200NotesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdPutResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsByIdentifierIdentifierGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsByIdentifierIdentifierGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsByIdentifierIdentifierGetResponse200NotesItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsByIdentifierIdentifierGetResponse200NotesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsByIdentifierIdentifierGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsByIdentifierIdentifierGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostBody::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdActivatePostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdActivatePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse200NotesItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdActivatePostResponse200NotesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdActivatePostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdActivatePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdActivatePostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdSuspendPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdSuspendPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse200NotesItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdSuspendPostResponse200NotesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdSuspendPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdSuspendPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdSuspendPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostBody::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdDeactivatePostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdDeactivatePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse200NotesItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdDeactivatePostResponse200NotesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdDeactivatePostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdDeactivatePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdDeactivatePostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdNotesPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdNotesPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse200NotesItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdNotesPostResponse200NotesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdNotesPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdNotesPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdApplicationsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsGetResponse200ApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdApplicationsGetResponse200ApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdApplicationsGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdApplicationsPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdApplicationsPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdApplicationsPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdEnablePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdApplicationsApplicationIdEnablePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdEnablePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdApplicationsApplicationIdEnablePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdDisablePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdApplicationsApplicationIdDisablePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdDisablePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiClientsIdApplicationsApplicationIdDisablePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsGetResponse200AnchorDomainsItem::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsGetResponse200AnchorDomainsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsIdPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiAnchorDomainsIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsGetResponse200ApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsGetResponse200ApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdPutResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsByCodeCodeGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsByCodeCodeGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsByCodeCodeGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsByCodeCodeGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdActivatePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdActivatePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdActivatePostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdDeactivatePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdDeactivatePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdDeactivatePostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdClientsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsGetResponse200ConfigsItem::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdClientsGetResponse200ConfigsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdClientsGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdClientsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdClientsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdClientsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdClientsPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdClientsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsClientIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdClientsClientIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdRolesGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdRolesGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdRolesGetResponse200RolesItem::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdRolesGetResponse200RolesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdRolesGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdRolesGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdProvisionServiceAccountPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdProvisionServiceAccountPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdProvisionServiceAccountPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdProvisionServiceAccountPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsIdProvisionServiceAccountPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiRolesGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesGetResponse200RolesItem::class => \FlowCatalyst\Generated\Normalizer\ApiRolesGetResponse200RolesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiRolesPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiRolesPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiRolesPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiRolesPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesRoleNameDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiRolesRoleNameDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesRoleNameGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiRolesRoleNameGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesRoleNameGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiRolesRoleNameGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutBody::class => \FlowCatalyst\Generated\Normalizer\ApiRolesRoleNamePutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiRolesRoleNamePutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiRolesRoleNamePutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiRolesRoleNamePutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiRolesRoleNamePutResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesBySourceSourceGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiRolesBySourceSourceGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesBySourceSourceGetResponse200RolesItem::class => \FlowCatalyst\Generated\Normalizer\ApiRolesBySourceSourceGetResponse200RolesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesBySourceSourceGetResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiRolesBySourceSourceGetResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesByApplicationApplicationIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiRolesByApplicationApplicationIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesByApplicationApplicationIdGetResponse200RolesItem::class => \FlowCatalyst\Generated\Normalizer\ApiRolesByApplicationApplicationIdGetResponse200RolesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesPermissionsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiRolesPermissionsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesPermissionsGetResponse200PermissionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiRolesPermissionsGetResponse200PermissionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesPermissionsPermissionGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiRolesPermissionsPermissionGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiRolesPermissionsPermissionGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiRolesPermissionsPermissionGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsGetResponse200ConfigsItem::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsGetResponse200ConfigsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsByDomainDomainGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsByDomainDomainGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsByDomainDomainGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsByDomainDomainGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsInternalPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsInternalPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsInternalPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsInternalPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsOidcPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsOidcPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsOidcPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsOidcPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdOidcPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdOidcPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdOidcPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdOidcPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdOidcPutResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutBody::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdConfigTypePutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdConfigTypePutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdConfigTypePutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdConfigTypePutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdConfigTypePutResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdAdditionalClientsPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdAdditionalClientsPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdAdditionalClientsPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdAdditionalClientsPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdGrantedClientsPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdGrantedClientsPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdGrantedClientsPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiAuthConfigsIdGrantedClientsPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsGetResponse200ClientsItem::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsGetResponse200ClientsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsGetResponse200ClientsItemApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsGetResponse200ClientsItemApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse201Client::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsPostResponse201ClientNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse201ClientApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsPostResponse201ClientApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdGetResponse200ApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdGetResponse200ApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse200ApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdPutResponse200ApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdPutResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsByClientIdClientIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsByClientIdClientIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsByClientIdClientIdGetResponse200ApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsByClientIdClientIdGetResponse200ApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsByClientIdClientIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsByClientIdClientIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdRegenerateSecretPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse200Client::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdRegenerateSecretPostResponse200ClientNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse200ClientApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdRegenerateSecretPostResponse200ClientApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdRegenerateSecretPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdRegenerateSecretPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdActivatePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdActivatePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdActivatePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdActivatePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdDeactivatePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdDeactivatePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdDeactivatePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdDeactivatePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdRotateSecretPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse200Client::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdRotateSecretPostResponse200ClientNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse200ClientApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdRotateSecretPostResponse200ClientApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdRotateSecretPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiOauthClientsIdRotateSecretPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuditLogsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuditLogsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuditLogsGetResponse200AuditLogsItem::class => \FlowCatalyst\Generated\Normalizer\ApiAuditLogsGetResponse200AuditLogsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuditLogsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuditLogsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuditLogsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiAuditLogsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuditLogsEntityEntityTypeEntityIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuditLogsEntityEntityTypeEntityIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuditLogsEntityEntityTypeEntityIdGetResponse200AuditLogsItem::class => \FlowCatalyst\Generated\Normalizer\ApiAuditLogsEntityEntityTypeEntityIdGetResponse200AuditLogsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuditLogsEntityTypesGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuditLogsEntityTypesGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuditLogsOperationsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuditLogsOperationsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuditLogsApplicationIdsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuditLogsApplicationIdsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiAuditLogsClientIdsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiAuditLogsClientIdsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesGetResponse200EventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesGetResponse200EventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesGetResponse200EventTypesItemSpecVersionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesGetResponse200EventTypesItemSpecVersionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse201SpecVersionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesPostResponse201SpecVersionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdGetResponse200SpecVersionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdGetResponse200SpecVersionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchBody::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdPatchBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdPatchResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse200SpecVersionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdPatchResponse200SpecVersionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdPatchResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdPatchResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdCodegenPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdCodegenPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdCodegenPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdCodegenPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdArchivePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdArchivePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdArchivePostResponse200SpecVersionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdArchivePostResponse200SpecVersionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdArchivePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdArchivePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdSchemasPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdSchemasPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse201SpecVersionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdSchemasPostResponse201SpecVersionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdSchemasPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdSchemasPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionFinalisePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdSchemasVersionFinalisePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionFinalisePostResponse200SpecVersionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdSchemasVersionFinalisePostResponse200SpecVersionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionFinalisePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdSchemasVersionFinalisePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionDeprecatePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdSchemasVersionDeprecatePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionDeprecatePostResponse200SpecVersionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdSchemasVersionDeprecatePostResponse200SpecVersionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionDeprecatePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesIdSchemasVersionDeprecatePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesSyncPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesSyncPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesSyncPostBodyEventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesSyncPostBodyEventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesSyncPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesSyncPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesSyncPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesSyncPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesFiltersApplicationsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesFiltersApplicationsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesFiltersSubdomainsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesFiltersSubdomainsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventTypesFiltersAggregatesGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventTypesFiltersAggregatesGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsGetResponse200PoolsItem::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsGetResponse200PoolsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsIdPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdSuspendPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsIdSuspendPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdSuspendPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsIdSuspendPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdActivatePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsIdActivatePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdActivatePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsIdActivatePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsSyncPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostBodyPoolsItem::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsSyncPostBodyPoolsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsSyncPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchPoolsSyncPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsGetResponse200ConnectionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsGetResponse200ConnectionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdDeleteResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdDeleteResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdPausePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdPausePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdPausePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdPausePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdActivatePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdActivatePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConnectionsIdActivatePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiConnectionsIdActivatePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsGetResponse200SubscriptionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsGetResponse200SubscriptionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsGetResponse200SubscriptionsItemEventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsGetResponse200SubscriptionsItemEventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsGetResponse200SubscriptionsItemCustomConfigItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsGetResponse200SubscriptionsItemCustomConfigItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsPostBodyEventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsPostBodyEventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsPostBodyCustomConfigItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsPostBodyCustomConfigItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse201EventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsPostResponse201EventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse201CustomConfigItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsPostResponse201CustomConfigItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse200EventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdGetResponse200EventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse200CustomConfigItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdGetResponse200CustomConfigItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutBodyEventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPutBodyEventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutBodyCustomConfigItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPutBodyCustomConfigItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse200EventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPutResponse200EventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse200CustomConfigItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPutResponse200CustomConfigItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPausePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse200EventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPausePostResponse200EventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse200CustomConfigItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPausePostResponse200CustomConfigItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdPausePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdResumePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse200EventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdResumePostResponse200EventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse200CustomConfigItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdResumePostResponse200CustomConfigItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsIdResumePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsSyncPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostBodySubscriptionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsSyncPostBodySubscriptionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostBodySubscriptionsItemEventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsSyncPostBodySubscriptionsItemEventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostBodySubscriptionsItemCustomConfigItem::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsSyncPostBodySubscriptionsItemCustomConfigItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsSyncPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiSubscriptionsSyncPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventsGetResponse200ItemsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventsGetResponse200ItemsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventsFilterOptionsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventsFilterOptionsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventsFilterOptionsGetResponse200ApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventsFilterOptionsGetResponse200ApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventsFilterOptionsGetResponse200SubdomainsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventsFilterOptionsGetResponse200SubdomainsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventsFilterOptionsGetResponse200AggregatesItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventsFilterOptionsGetResponse200AggregatesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventsFilterOptionsGetResponse200TypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiEventsFilterOptionsGetResponse200TypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEventsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEventsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEventsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsGetResponse200ItemsItem::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsGetResponse200ItemsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsFilterOptionsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200ApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsFilterOptionsGetResponse200ApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200SubdomainsItem::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsFilterOptionsGetResponse200SubdomainsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200AggregatesItem::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsFilterOptionsGetResponse200AggregatesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200CodesItem::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsFilterOptionsGetResponse200CodesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200StatusesItem::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsFilterOptionsGetResponse200StatusesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsIdAttemptsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsIdAttemptsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsIdAttemptsGetResponse200AttemptsItem::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsIdAttemptsGetResponse200AttemptsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiDispatchJobsIdAttemptsGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiDispatchJobsIdAttemptsGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersGetResponse200IdentityProvidersItem::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersGetResponse200IdentityProvidersItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersIdPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiIdentityProvidersIdPutResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsGetResponse200MappingsItem::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsGetResponse200MappingsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsIdPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsIdPutResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsLookupDomainGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsLookupDomainGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsLookupDomainGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiEmailDomainMappingsLookupDomainGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsGetResponse200ServiceAccountsItem::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsGetResponse200ServiceAccountsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse201ServiceAccount::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsPostResponse201ServiceAccountNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse201Oauth::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsPostResponse201OauthNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse201Webhook::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsPostResponse201WebhookNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsCodeCodeGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsCodeCodeGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsCodeCodeGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsCodeCodeGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdAuthTokenPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdAuthTokenPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdAuthTokenPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdAuthTokenPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateTokenPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRegenerateTokenPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateTokenPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRegenerateTokenPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateAuthTokenPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRegenerateAuthTokenPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateAuthTokenPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRegenerateAuthTokenPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSecretPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRegenerateSecretPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSecretPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRegenerateSecretPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSigningSecretPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRegenerateSigningSecretPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSigningSecretPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRegenerateSigningSecretPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRolesGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesGetResponse200RolesItem::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRolesGetResponse200RolesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRolesGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRolesPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRolesPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse200RolesItem::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRolesPutResponse200RolesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRolesPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiServiceAccountsIdRolesPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPlatformCorsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPlatformCorsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPlatformCorsGetResponse200CorsOriginsItem::class => \FlowCatalyst\Generated\Normalizer\ApiPlatformCorsGetResponse200CorsOriginsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPlatformCorsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiPlatformCorsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiPlatformCorsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiPlatformCorsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiPlatformCorsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPlatformCorsAllowedGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPlatformCorsAllowedGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPlatformCorsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPlatformCorsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPlatformCorsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPlatformCorsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPlatformCorsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiPlatformCorsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeGetResponse200ItemsItem::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeGetResponse200ItemsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeGetResponse403::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeGetResponse403Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionGetResponse403::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionGetResponse403Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyDeleteResponse403::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionPropertyDeleteResponse403Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionPropertyDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionPropertyGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse403::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionPropertyGetResponse403Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionPropertyGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionPropertyPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionPropertyPutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionPropertyPutResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionPropertyPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse403::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAppCodeSectionPropertyPutResponse403Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAccessAppCodeGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeGetResponse200ItemsItem::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAccessAppCodeGetResponse200ItemsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostBody::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAccessAppCodePostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAccessAppCodePostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAccessAppCodePostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodeDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAccessAppCodeRoleCodeDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutBody::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAccessAppCodeRoleCodePutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAccessAppCodeRoleCodePutResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiConfigAccessAppCodeRoleCodePutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiLoginAttemptsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiLoginAttemptsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiLoginAttemptsGetResponse200ItemsItem::class => \FlowCatalyst\Generated\Normalizer\ApiLoginAttemptsGetResponse200ItemsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsGetResponse200ScheduledJobsItem::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsGetResponse200ScheduledJobsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchBody::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdPatchBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdPatchResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdPatchResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdPatchResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdPausePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdPausePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdPausePostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdResumePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdResumePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdResumePostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdArchivePostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdArchivePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdArchivePostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostBody::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdFirePostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse202::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdFirePostResponse202Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdFirePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsIdFirePostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsSyncPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostBodyScheduledJobsItem::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsSyncPostBodyScheduledJobsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsSyncPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsSyncPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse200InstancesItem::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesGetResponse200InstancesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesInstanceIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesInstanceIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesInstanceIdLogsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse200LogsItem::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesInstanceIdLogsGetResponse200LogsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesInstanceIdLogsGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesInstanceIdLogPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesInstanceIdLogPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesInstanceIdLogPostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostBody::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesInstanceIdCompletePostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiScheduledJobsInstancesInstanceIdCompletePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesGetResponse200ItemsItem::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesGetResponse200ItemsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesPostResponse201::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesPostResponse201Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesPostResponse409::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesPostResponse409Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesIdDeleteResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesIdDeleteResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesIdPutBody::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesIdPutBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesIdPutResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesIdPutResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesIdPutResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesIdPutResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesByCodeCodeGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesByCodeCodeGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesByCodeCodeGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesByCodeCodeGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiProcessesIdArchivePostResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiProcessesIdArchivePostResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeRolesSyncPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostBodyRolesItem::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeRolesSyncPostBodyRolesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostBodyRolesItemPermissionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeRolesSyncPostBodyRolesItemPermissionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeRolesSyncPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeRolesSyncPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeEventTypesSyncPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostBodyEventTypesItem::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeEventTypesSyncPostBodyEventTypesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeEventTypesSyncPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeEventTypesSyncPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeSubscriptionsSyncPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItem::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeSubscriptionsSyncPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeSubscriptionsSyncPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeDispatchPoolsSyncPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostBodyPoolsItem::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeDispatchPoolsSyncPostBodyPoolsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeDispatchPoolsSyncPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeDispatchPoolsSyncPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodePrincipalsSyncPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostBodyPrincipalsItem::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodePrincipalsSyncPostBodyPrincipalsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodePrincipalsSyncPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodePrincipalsSyncPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostBody::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeProcessesSyncPostBodyNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostBodyProcessesItem::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeProcessesSyncPostBodyProcessesItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeProcessesSyncPostResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostResponse400::class => \FlowCatalyst\Generated\Normalizer\ApiApplicationsAppCodeProcessesSyncPostResponse400Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsGetResponse200ClientsItem::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsGetResponse200ClientsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsGetResponse401::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsGetResponse401Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsClientIdGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsClientIdGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsClientIdGetResponse401::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsClientIdGetResponse401Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsClientIdGetResponse403::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsClientIdGetResponse403Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsClientIdGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsClientIdGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsClientIdApplicationsGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsClientIdApplicationsGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsClientIdApplicationsGetResponse200ApplicationsItem::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsClientIdApplicationsGetResponse200ApplicationsItemNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsClientIdApplicationsGetResponse401::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsClientIdApplicationsGetResponse401Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsClientIdApplicationsGetResponse403::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsClientIdApplicationsGetResponse403Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiMeClientsClientIdApplicationsGetResponse404::class => \FlowCatalyst\Generated\Normalizer\ApiMeClientsClientIdApplicationsGetResponse404Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPublicLoginThemeGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPublicLoginThemeGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPublicPlatformGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiPublicPlatformGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiPublicPlatformGetResponse200Features::class => \FlowCatalyst\Generated\Normalizer\ApiPublicPlatformGetResponse200FeaturesNormalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigLoginThemeGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConfigLoginThemeGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigPlatformGetResponse200::class => \FlowCatalyst\Generated\Normalizer\ApiConfigPlatformGetResponse200Normalizer::class,
        
        \FlowCatalyst\Generated\Model\ApiConfigPlatformGetResponse200Features::class => \FlowCatalyst\Generated\Normalizer\ApiConfigPlatformGetResponse200FeaturesNormalizer::class,
        
        \Jane\Component\JsonSchemaRuntime\Reference::class => \FlowCatalyst\Generated\Runtime\Normalizer\ReferenceNormalizer::class,
    ], $normalizersCache = [];
    public function supportsDenormalization(mixed $data, string $type, ?string $format = null, array $context = []): bool
    {
        return array_key_exists($type, $this->normalizers);
    }
    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return is_object($data) && array_key_exists(get_class($data), $this->normalizers);
    }
    public function normalize(mixed $data, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $normalizerClass = $this->normalizers[get_class($data)];
        $normalizer = $this->getNormalizer($normalizerClass);
        return $normalizer->normalize($data, $format, $context);
    }
    public function denormalize(mixed $data, string $type, ?string $format = null, array $context = []): mixed
    {
        $denormalizerClass = $this->normalizers[$type];
        $denormalizer = $this->getNormalizer($denormalizerClass);
        return $denormalizer->denormalize($data, $type, $format, $context);
    }
    private function getNormalizer(string $normalizerClass)
    {
        return $this->normalizersCache[$normalizerClass] ?? $this->initNormalizer($normalizerClass);
    }
    private function initNormalizer(string $normalizerClass)
    {
        $normalizer = new $normalizerClass();
        $normalizer->setNormalizer($this->normalizer);
        $normalizer->setDenormalizer($this->denormalizer);
        $this->normalizersCache[$normalizerClass] = $normalizer;
        return $normalizer;
    }
    public function getSupportedTypes(?string $format = null): array
    {
        return [
            
            \FlowCatalyst\Generated\Model\ApiPrincipalsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsGetResponse200PrincipalsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsUsersPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdActivatePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdActivatePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdDeactivatePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdDeactivatePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdResetPasswordPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesGetResponse200RolesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse200RolesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdRolesRoleDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessGetResponse200GrantsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdClientAccessClientIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsCheckEmailDomainGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsCheckEmailDomainGetResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessGetResponse200ApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse200ApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdApplicationAccessPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdAvailableApplicationsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdAvailableApplicationsGetResponse200ApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiPrincipalsIdAvailableApplicationsGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsGetResponse200ClientsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsGetResponse200ClientsItemNotesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsPostResponse201NotesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsSearchGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsSearchGetResponse200ClientsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsSearchGetResponse200ClientsItemNotesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdGetResponse200NotesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse200NotesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdPutResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsByIdentifierIdentifierGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsByIdentifierIdentifierGetResponse200NotesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsByIdentifierIdentifierGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse200NotesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdActivatePostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse200NotesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdSuspendPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse200NotesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdDeactivatePostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse200NotesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdNotesPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsGetResponse200ApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdEnablePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdEnablePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdDisablePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiClientsIdApplicationsApplicationIdDisablePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsGetResponse200AnchorDomainsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiAnchorDomainsIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsGetResponse200ApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdPutResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsByCodeCodeGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsByCodeCodeGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdActivatePostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdDeactivatePostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsGetResponse200ConfigsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdClientsClientIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdRolesGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdRolesGetResponse200RolesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdRolesGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsIdProvisionServiceAccountPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesGetResponse200RolesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesRoleNameDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesRoleNameGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesRoleNameGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesRoleNamePutResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesBySourceSourceGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesBySourceSourceGetResponse200RolesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesBySourceSourceGetResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesByApplicationApplicationIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesByApplicationApplicationIdGetResponse200RolesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesPermissionsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesPermissionsGetResponse200PermissionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesPermissionsPermissionGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiRolesPermissionsPermissionGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsGetResponse200ConfigsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsByDomainDomainGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsByDomainDomainGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsInternalPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsOidcPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdOidcPutResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdConfigTypePutResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdAdditionalClientsPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiAuthConfigsIdGrantedClientsPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsGetResponse200ClientsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsGetResponse200ClientsItemApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse201Client::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse201ClientApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdGetResponse200ApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse200ApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdPutResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsByClientIdClientIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsByClientIdClientIdGetResponse200ApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsByClientIdClientIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse200Client::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse200ClientApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdRegenerateSecretPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdActivatePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdActivatePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdDeactivatePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdDeactivatePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse200Client::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse200ClientApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiOauthClientsIdRotateSecretPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAuditLogsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuditLogsGetResponse200AuditLogsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiAuditLogsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuditLogsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiAuditLogsEntityEntityTypeEntityIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuditLogsEntityEntityTypeEntityIdGetResponse200AuditLogsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiAuditLogsEntityTypesGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuditLogsOperationsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuditLogsApplicationIdsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiAuditLogsClientIdsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesGetResponse200EventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesGetResponse200EventTypesItemSpecVersionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse201SpecVersionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdGetResponse200SpecVersionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchBody::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse200SpecVersionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdPatchResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdCodegenPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdArchivePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdArchivePostResponse200SpecVersionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdArchivePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse201SpecVersionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionFinalisePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionFinalisePostResponse200SpecVersionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionFinalisePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionDeprecatePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionDeprecatePostResponse200SpecVersionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesIdSchemasVersionDeprecatePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesSyncPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesSyncPostBodyEventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesSyncPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesSyncPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesFiltersApplicationsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesFiltersSubdomainsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventTypesFiltersAggregatesGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsGetResponse200PoolsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdSuspendPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdSuspendPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdActivatePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsIdActivatePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostBodyPoolsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchPoolsSyncPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsGetResponse200ConnectionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdDeleteResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdPausePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdPausePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdActivatePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConnectionsIdActivatePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsGetResponse200SubscriptionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsGetResponse200SubscriptionsItemEventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsGetResponse200SubscriptionsItemCustomConfigItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsPostBodyEventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsPostBodyCustomConfigItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse201EventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse201CustomConfigItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse200EventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse200CustomConfigItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutBodyEventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutBodyCustomConfigItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse200EventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse200CustomConfigItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse200EventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse200CustomConfigItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdPausePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse200EventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse200CustomConfigItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsIdResumePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostBodySubscriptionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostBodySubscriptionsItemEventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostBodySubscriptionsItemCustomConfigItem::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiSubscriptionsSyncPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiEventsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventsGetResponse200ItemsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventsFilterOptionsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventsFilterOptionsGetResponse200ApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventsFilterOptionsGetResponse200SubdomainsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventsFilterOptionsGetResponse200AggregatesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventsFilterOptionsGetResponse200TypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEventsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEventsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsGetResponse200ItemsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200ApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200SubdomainsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200AggregatesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200CodesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsFilterOptionsGetResponse200StatusesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsIdAttemptsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsIdAttemptsGetResponse200AttemptsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiDispatchJobsIdAttemptsGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersGetResponse200IdentityProvidersItem::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiIdentityProvidersIdPutResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsGetResponse200MappingsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsIdPutResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsLookupDomainGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiEmailDomainMappingsLookupDomainGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsGetResponse200ServiceAccountsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse201ServiceAccount::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse201Oauth::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse201Webhook::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsCodeCodeGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsCodeCodeGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdAuthTokenPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateTokenPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateTokenPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateAuthTokenPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateAuthTokenPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSecretPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSecretPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSigningSecretPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRegenerateSigningSecretPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesGetResponse200RolesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse200RolesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiServiceAccountsIdRolesPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPlatformCorsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPlatformCorsGetResponse200CorsOriginsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiPlatformCorsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiPlatformCorsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiPlatformCorsAllowedGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPlatformCorsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPlatformCorsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPlatformCorsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeGetResponse200ItemsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeGetResponse403::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionGetResponse403::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyDeleteResponse403::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse403::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAppCodeSectionPropertyPutResponse403::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeGetResponse200ItemsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodePostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodeDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigAccessAppCodeRoleCodePutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiLoginAttemptsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiLoginAttemptsGetResponse200ItemsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsGetResponse200ScheduledJobsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchBody::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPatchResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdPausePostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdResumePostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdArchivePostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse202::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsIdFirePostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostBodyScheduledJobsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsSyncPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse200InstancesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse200LogsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogsGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdLogPostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiScheduledJobsInstancesInstanceIdCompletePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesGetResponse200ItemsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesPostResponse201::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesPostResponse409::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesIdDeleteResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesIdPutBody::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesIdPutResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesIdPutResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesByCodeCodeGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesByCodeCodeGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiProcessesIdArchivePostResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostBodyRolesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostBodyRolesItemPermissionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeRolesSyncPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostBodyEventTypesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeEventTypesSyncPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostBodySubscriptionsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeSubscriptionsSyncPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostBodyPoolsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeDispatchPoolsSyncPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostBodyPrincipalsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodePrincipalsSyncPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostBody::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostBodyProcessesItem::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiApplicationsAppCodeProcessesSyncPostResponse400::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsGetResponse200ClientsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsGetResponse401::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsClientIdGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsClientIdGetResponse401::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsClientIdGetResponse403::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsClientIdGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsClientIdApplicationsGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsClientIdApplicationsGetResponse200ApplicationsItem::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsClientIdApplicationsGetResponse401::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsClientIdApplicationsGetResponse403::class => false,
            \FlowCatalyst\Generated\Model\ApiMeClientsClientIdApplicationsGetResponse404::class => false,
            \FlowCatalyst\Generated\Model\ApiPublicLoginThemeGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPublicPlatformGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiPublicPlatformGetResponse200Features::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigLoginThemeGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigPlatformGetResponse200::class => false,
            \FlowCatalyst\Generated\Model\ApiConfigPlatformGetResponse200Features::class => false,
            \Jane\Component\JsonSchemaRuntime\Reference::class => false,
        ];
    }
}