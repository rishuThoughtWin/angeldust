function Check({comment, checked = false, onclick}) {
  return(
    <div className="filter__checkboxes mb-3" onClick={onclick}>
      <input
        id="type5"
        type="checkbox"
        name="type5"
        checked={checked}
        // onChange={}
      />
      <label htmlFor="type5" style={{ fontSize: 14 }}>
        {comment}
      </label>
    </div>
  )
}

export default Check