import { NovariApiManager } from "novari-frontend-components";
import type { IContract, IContractModal } from "~/types/IContract";
import { useLoaderData } from "react-router";
import {
  Modal,
  Table,
  Heading,
  Pagination,
  Search,
  HStack,
  VStack,
} from "@navikt/ds-react";
import React, { useMemo, useState } from "react";

const API_URL = process.env.API_URL;

export const loader = async () => {
  const api = new NovariApiManager({
    baseUrl: API_URL || "not-set",
  });

  const response = await api.call({
    method: "GET",
    endpoint: "/contract",
    functionName: "getAllContracts",
  });

  return { contracts: response.data as IContract[] };
};

const PAGE_SIZE = 20;

const ContractList: React.FC = () => {
  const { contracts } = useLoaderData<{ contracts: IContract[] }>();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState<IContractModal>({
    open: false,
    contract: null,
  });

  const filteredBySearch = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return contracts;

    return contracts.filter((contract) =>
      [
        contract.adapterId,
        contract.userName,
        contract.orgId?.toString(),
      ]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query))
    );
  }, [searchQuery, contracts]);

  const pageContracts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBySearch.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredBySearch]);

  return (
    <HStack gap="4" className="w-full">
      <form role="search" className="flex-1" onSubmit={(e) => e.preventDefault()}>
        <Search
          label="Søk i kontrakter"
          variant="secondary"
          value={searchQuery}
          onChange={(value: string) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          placeholder="Søk på adapterId, brukernavn eller orgId"
          autoComplete="off"
        />
      </form>
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, contract: null })}
        aria-labelledby="contract-modal-heading"
        closeOnBackdropClick
      >
        <Modal.Header>
          <Heading level="1" size="small" id="contract-modal-heading">
            {modal.contract?.adapterId.replaceAll("&", "/") ?? "Detaljer"}
          </Heading>
        </Modal.Header>
        <Modal.Body>
          <pre className="max-w-full max-h-96 overflow-auto text-sm">
            {modal.contract && JSON.stringify(modal.contract, null, 2).replaceAll("&", "/")}
          </pre>
        </Modal.Body>
      </Modal>

      <Table size="small" style={{ tableLayout: "fixed" }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">AdapterId</Table.HeaderCell>
            <Table.HeaderCell scope="col">Username</Table.HeaderCell>
            <Table.HeaderCell scope="col">OrgId</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pageContracts.map((contract) => (
            <Table.Row
              key={contract.adapterId}
              onClick={() => setModal({ open: true, contract })}
            >
              <Table.DataCell className="max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
                {contract.adapterId.replaceAll("&", "/")}
              </Table.DataCell>
              <Table.DataCell className="max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
                {contract.userName}
              </Table.DataCell>
              <Table.DataCell>{contract.orgId}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Pagination
        page={currentPage}
        onPageChange={setCurrentPage}
        count={Math.ceil(filteredBySearch.length / PAGE_SIZE)}
        size="small"
        className="p-3"
      />
    </HStack>
  );
};

export default ContractList;
