/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import moment from "moment";

export class DateUtils {

  private static dataFormat: string = "MM/DD/YYYY hh:mm:ss.SSS A";

  public static formatDate(date: Date): string {
    const dateStr = moment(date).format(DateUtils.dataFormat);
    return dateStr;
  }

  public static parseDate(value: string): Date {
    return moment(value).utc().toDate();
  }

  public static validate(value: string): boolean {
    return moment(value, DateUtils.dataFormat, true).isValid();
  }
}
