const moment = require("moment")

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },

  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + " "
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(" "))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + "..."
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, "")
  },
  editIcon: function (postAuthor, loggedUser, storyId) {
    if (postAuthor._id.toString() == loggedUser._id.toString()) {
      return `<div class="dropdown float-right">
      <button class="btn btn-info btn-sm dropdown-toggle" type="button" id="dropdownMenuButton"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Action
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item" href="/post/edit/${storyId}/">Edit</a>
          <form class='p-0 m-0' action='/post/delete/${storyId}' method='POST' >
          <input type="hidden" name='_method' value="DELETE">
          <button class="dropdown-item" type='submit'>Delete</button>
          </form>
      </div>
  </div>`
    } else {
      return ""
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      )
  },
  checkCurrentGreaterOne: function (current) {
    return current > 1
  },
  parseInt: function (current) {
    return parseInt(current)
  },
}
