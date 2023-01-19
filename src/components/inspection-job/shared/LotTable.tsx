import { Table } from '../../../bootstrap';
import { IInspectionJob } from '../../../features/inspectionJob/inspectionJobSlice';
import { IPackingJob } from '../../../features/packingJobList/packingJobListSlice';

export function LotTable(props: { lot: IInspectionJob | IPackingJob }) {
    return (
        <>
            <Table borderless={true}>
                <thead>
                    <tr>
                        <td className="form-label">Part Number</td>
                        <td className="form-label">Package Type</td>
                        <td className="form-label">Weighed</td>
                        <td className="form-label">Deflashed</td>
                        <td className="form-label">Packing Operator</td>
                        <td className="form-label">Total Quantity Produced</td>
                        <td className="form-label">Serial Range</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="mb-1">{props.lot.part!.partCode}</td>
                        <td className="mb-1">
                            {props.lot.partPackaging!.packageCode}
                        </td>
                        <td
                            className={`mb-1${
                                !props.lot.pieceWeightValid
                                    ? ' px-3 text-white bg-warning'
                                    : ''
                            }`}
                        >{`${
                            props.lot.pieceWeightQuantity
                        } @ ${props.lot.pieceWeight?.toPrecision(3)}${
                            !props.lot.pieceWeightValid
                                ? ` !! ${props.lot.pieceWeightDiscrepancyNote} !!`
                                : ''
                        }`}</td>
                        <td className="mb-1">{`By ${props.lot.deflashOperator} @ ${props.lot.deflashMachineCode}`}</td>
                        <td className="mb-1">{props.lot.packingOperator}</td>
                        <td className="mb-1">{`${
                            props.lot.completeBoxes
                                ? `${
                                      props.lot.completeBoxes
                                  } @ ${props.lot.partPackaging!.standardPack.toLocaleString()}${
                                      props.lot.partialBoxQuantity ? ' + ' : ''
                                  }`
                                : ''
                        }${
                            props.lot.partialBoxQuantity
                                ? `${props.lot.partialBoxQuantity.toLocaleString()}`
                                : ''
                        } = ${(
                            (props.lot.completeBoxes || 0) *
                                props.lot.partPackaging!.standardPack +
                            (props.lot.partialBoxQuantity || 0)
                        ).toLocaleString()} pieces`}</td>
                        <td className="mb-1">{`${
                            props.lot.objects[0]?.serial
                        }${`${
                            props.lot.objects.length > 1
                                ? ` to ${
                                      props.lot.objects[
                                          props.lot.objects.length - 1
                                      ]?.serial
                                  }`
                                : ''
                        }`}`}</td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
}
