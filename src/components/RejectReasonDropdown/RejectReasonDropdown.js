import React from "react";
import { useQuery } from 'react-query';
import { defaultRoutes as api } from "../../services/Server/Server";
import Endpoint from "../../services/Server/Endpoint";
import SvgSymbol from '../SvgSymbol/SvgSymbol'

const SelectOptions = (props) => {
  const defaultOption = [
    <option key="-1" value="-1" />
  ]

  if (props.options?.length) {
    const filteredOptions = props.options.filter(option => {
      if (props.rt === option.id) {
        return true
      }

      if (props.rejectTags.includes(option.id)) {
        return false
      }
  
      return true;
    })

    const actualOptions = filteredOptions.map((option) => {
      return (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      )
    })

    return defaultOption.concat(actualOptions)
  } else {
    return defaultOption
  }
}

const useRejectReasonOptions = () => {
  const query = useQuery('rejectionTags', () =>
    new Endpoint(api.keywords.find, { params: { tagType: "reject", limit: 1000 } }).execute()
  )

  return query;
}

const RejectReasonDropdown = (props) => {
  const options = useRejectReasonOptions();

  return (
    <div className="mr-mt-4">
      {props.rejectTags?.length ? props.rejectTags.map((rt, index) => {
        return (
          <div className="mr-mt-4 mr-mb-2" key={index}>
            <div className="mr-mb-1">Reject Reason</div>
            <div className="mr-flex">
              <select
                key="name-review-reject"
                className="form-select form-control"
                onChange={(e) => props.onChange(e, index)}
                value={rt}
              >
                <SelectOptions options={options.data} rejectTags={props.rejectTags} rt={rt} />
              </select>
              <button
                className="is-clear array-field__item__control remove-item-button button mr-ml-2"
                onClick={() => props.removeRejectTag(index)}
              >
              <span className="icon is-danger">
                <SvgSymbol sym="trash-icon" viewBox='0 0 20 20' className="mr-w-5 mr-h-5"/>
              </span>
              </button>
            </div>
          </div>
        )
      }): null}
      {props.rejectTags?.length < 5 && props.rejectTags?.length < options.data?.length
        ? <div className="mr-underline mr-cursor-pointer mr-text-green-light" onClick={props.addRejectTag}>Add Reject Reason</div> 
        : null
      }
    </div>
  )
}

export default RejectReasonDropdown;
