import {NovariApiManager} from "novari-frontend-components"
import type {IContract, IContractModal} from "~/types/IContract";
import {type ActionFunction, data, useFetcher, useLoaderData} from "react-router";
import {Button, Modal, Table, Heading, Pagination} from "@navikt/ds-react";
import React, {useEffect, useRef, useState} from "react";

const API_URL = process.env.API_URL;

export const loader = async () => {
  const api = new NovariApiManager({
    baseUrl: API_URL || "not-set"
  })

  const response = await api.call({
    method: 'GET',
    endpoint: '/contract',
    functionName: 'getAllContracts'
  });

  return {contracts: response.data, variant: response.variant, success: response.success};

}

const ContractList = () => {
  const {contracts} = useLoaderData<{ contracts: IContract[]; variant: string }>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modal, setModal] = useState<IContractModal>({
    open: false,
    contract: null,
  });

  const pageContracts = contracts.slice(
    (currentPage - 1) * 20,
    currentPage * 20
  );


  return (
    <div>
      <Modal
        open={modal.open}
        onClose={() => setModal({open: false, contract: null})}
        aria-labelledby="modal-heading"
        closeOnBackdropClick
      >
        <Modal.Header>
          <Heading level="1" size="small" id="modal-heading">
            {modal.contract?.adapterId}
          </Heading>
        </Modal.Header>
        <Modal.Body>
          <pre className="max-w-full max-h-96 overflow-auto text-sm">
            {JSON.stringify(modal.contract, null, 2)}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          {modal.contract?.adapterId}
        </Modal.Footer>
      </Modal>

      <Table style={{tableLayout: "fixed"}} size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">AdapterId</Table.HeaderCell>
            <Table.HeaderCell scope="col">Username</Table.HeaderCell>
            <Table.HeaderCell scope="col">orgId</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pageContracts.map((contract: IContract, i: number) => {
            return (
              <Table.Row key={i}
                         onClick={() => setModal({open: true, contract})}
              >
                <Table.DataCell
                  className="max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {contract.adapterId.replaceAll("&", "/")}
                </Table.DataCell>
                <Table.DataCell
                  className="max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {contract.userName}
                </Table.DataCell>
                <Table.DataCell>{contract.orgId}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <Pagination
        page={currentPage}
        onPageChange={(page: number) => setCurrentPage(page)}
        count={Math.ceil(contracts.length / 20)}
        size="small"
        className={"p-3"}
      />
    </div>
  )
}

export default ContractList;
