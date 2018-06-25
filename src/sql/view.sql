SELECT
	`a`.`task_id` AS `task_id`,
	`a`.`dept_id` AS `dept_id`,
	`a`.`被评价部门` AS `被评价部门`,
	`a`.`主管领导` AS `主管领导`,
	`a`.`leader_uid` AS `leader_uid`,
	`a`.`工作效果` AS `工作效果`,
	`a`.`团队建设` AS `团队建设`,
	`a`.`服务配合` AS `服务配合`,
	`a`.`持续改进` AS `持续改进`,
	`a`.`最高分` AS `最高分`,
	`a`.`最低分` AS `最低分`,
	`a`.`算术平均分` AS `算术平均分`,
	round(`b`.`领导评分`, 2) AS `领导评分`,
	round(ifnull(`c`.`部门互评`,0), 2) AS `部门互评`,
	round(
		(`b`.`领导评分` * d.ratio_leader) + ifnull(`c`.`部门互评` * d.ratio_user,0),
		2
	) AS `总分`
FROM
	(
		SELECT
			`a`.`task_id` AS `task_id`,
			`a`.`dept_id` AS `dept_id`,
			`a`.`被评价部门` AS `被评价部门`,
			`a`.`主管领导` AS `主管领导`,
			`a`.`leader_uid` AS `leader_uid`,
			round(avg(`a`.`工作效果`), 2) AS `工作效果`,
			round(avg(`a`.`团队建设`), 2) AS `团队建设`,
			round(avg(`a`.`服务配合`), 2) AS `服务配合`,
			round(avg(`a`.`持续改进`), 2) AS `持续改进`,
			max(`a`.`总分`) AS `最高分`,
			min(`a`.`总分`) AS `最低分`,
			round(avg(`a`.`总分`), 3) AS `算术平均分`
		FROM
			`kpi`.`view_score_list` `a`
		GROUP BY
			`a`.`task_id`,
			`a`.`dept_id`,
			`a`.`被评价部门`,
			`a`.`主管领导`
	) `a`
LEFT JOIN (
	SELECT
		`a`.`task_id` AS `task_id`,
		`a`.`dept_id` AS `dept_id`,
		`a`.`被评价部门` AS `被评价部门`,
		(
			sum((`a`.`总分` * `a`.`ratio`)) / sum(`a`.`ratio`)
		) AS `领导评分`
	FROM
		`kpi`.`view_score_list` `a`
	WHERE
		(`a`.`ratio` > 0)
	GROUP BY
		`a`.`task_id`,
		`a`.`dept_id`,
		`a`.`被评价部门`
) `b` ON `a`.`dept_id` = `b`.`dept_id`
AND `a`.`task_id` = `b`.`task_id`
LEFT JOIN (
	SELECT
		`a`.`task_id` AS `task_id`,
		`a`.`dept_id` AS `dept_id`,
		`a`.`被评价部门` AS `被评价部门`,
		(
			(
				(
					sum(`a`.`总分`) - max(`a`.`总分`)
				) - min(`a`.`总分`)
			) / (count(0) - 2)
		) AS `部门互评`
	FROM
		`kpi`.`view_score_list` `a`
	WHERE
		`a`.`ratio` = 0
	GROUP BY
		`a`.`task_id`,
		`a`.`dept_id`,
		`a`.`被评价部门`
) `c` ON `a`.`dept_id` = `c`.`dept_id`
AND `a`.`task_id` = `c`.`task_id`
INNER JOIN data_task d on a.task_id=d.id