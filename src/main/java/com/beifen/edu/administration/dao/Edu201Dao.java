package com.beifen.edu.administration.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu201;

@Configuration
public interface Edu201Dao extends JpaRepository<Edu201, Long>, JpaSpecificationExecutor<Edu201> {
	// 根据id任务书
	@Transactional
	@Modifying
	@Query(value = "delete from edu201 where Edu201_ID =?1", nativeQuery = true)
	void removeTasks(String id);

	//根据ID查询任务书
	@Query(value = "select * from edu201 e where e.Edu201_ID=?1", nativeQuery = true)
	public Edu201 queryTaskByID(String iD);
	
	
	// 根据教师id 查询教师id为主要老师的任务书
	@Query(value = "select * from edu201 e where e.zyls like %?1%", nativeQuery = true)
	public List<Edu201> queryMainTaskByTeacherID(String teacherId);

	// 根据教师id 查询教师id为老师的任务书
	@Query(value = "select * from edu201 e where e.ls like %?1%", nativeQuery = true)
	public List<Edu201> queryTaskByTeacherID(String teacherId);

	//任务书反馈意见
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET fkyj =?2 WHERE Edu201_ID =?1", nativeQuery = true)
	void chengeTaskFfkyj(String id, String feedBack);

	// 修改任务书状态
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET sszt =?2 WHERE Edu201_ID =?1", nativeQuery = true)
	void changeTaskStatus(String id, String status);

	//根据108ID查询待排任务书
	@Query(value = "select * from edu201 e where e.Edu108_ID=?1 and e.sszt='pass'", nativeQuery = true)
	Edu201 getTaskByEdu108Id(String edu108id);

	//根据201ID查询任务书
	@Query(value = "select * from edu201 e where e.Edu201_ID=?1", nativeQuery = true)
	Edu201 getTaskById(String edu108id);

	//审批结束后回写状态
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET sszt =?2 WHERE Edu201_ID =?1", nativeQuery = true)
    void updateState(String businessKey, String pass);

	//排课后改变任务是是否已排课
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET sfypk ='T' WHERE Edu201_ID =?1", nativeQuery = true)
    void taskPutSchedule(String edu201ID);
}
