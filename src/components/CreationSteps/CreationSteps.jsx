import React, { useState } from "react";

import "./creationSteps.css";

const stepIndex = "step1" | "step3" | "step4";

const steps = [
  { type: "step1", title: "Collection Details" },
  // { type: "step2", title: "Upload Images" },
  { type: "step3", title: "Deploy to chain" },
  { type: "step4", title: "Success!" },
];
const isReached = (
  currentStepType = stepIndex,
  reachedStepType = stepIndex
) => {
  const currentStepIndex = steps.findIndex(
    (step) => step.type === currentStepType
  );
  const reachedStepIndex = steps.findIndex(
    (step) => step.type === reachedStepType
  );
  return currentStepIndex <= reachedStepIndex;
};

// const getStepIndex = (stepType) =>
//   steps.findIndex((step) => step.type === stepType);

export const CreationSteps = (props) => {
  const { reachedStepType } = props;
  const [classAdd, setClassAdd] = useState("active")
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const stepIndex = index + 1;
        return (
          <>
            {isReached(step.type, reachedStepType) && (
              <div className="stepper_content p-0 m-0">
                <ul>
                  <li className="step_text active">
                    <span className="indexCount">
                      1
                    </span>
                    
                    Collection Details
                  </li>
{/* 
                  <li className={`step_text ${props.secondClass}`}>
                    <span className="indexCount">
                      2
                    </span>
                    Upload Images
                  </li> */}
                  <li className={`step_text ${props.thirdClass}`}>
                    <span className="indexCount">
                      2
                    </span>
                    Deploy to chain
                  </li>

                  <li className={`step_text ${props.fourthClass}`}>
                    <span className="indexCount">
                      3
                    </span>
                    Success!
                  </li>
                </ul>
                {/* <span className="indexCount">{stepIndex} </span>
                <span className="step_text"> {step.title}</span> */}
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};
